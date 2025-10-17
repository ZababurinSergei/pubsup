/* eslint-disable no-console */

import { createServer } from 'node:http'
import { http } from '@libp2p/http'
import { pingHTTP } from '@libp2p/http-ping'
import { canHandle } from '@libp2p/http-server/node'
import { createLibp2p } from 'libp2p'
import { HTTP_TEST_PROTOCOL } from './common.js'
import peerData from '../../peerId.mjs'
import {identify} from "@libp2p/identify";
import {circuitRelayServer} from "@libp2p/circuit-relay-v2";
import {ping} from "@libp2p/ping";
import {webSockets} from "./websockets/dist/src/index.js";
import {noise} from "@chainsafe/libp2p-noise";
import {yamux} from "@chainsafe/libp2p-yamux";
import express from "express";
import compression from "compression";
import cors from "cors";
import {htmlResponse} from './htmlResponse.mjs'
import path from "path";
import process from "node:process";
import * as dotenv from "dotenv";

const __dirname = process.cwd();

dotenv.config();

const peerId = await peerData()

const RENDER_EXTERNAL_HOSTNAME = process.env.RENDER_EXTERNAL_HOSTNAME ? process.env.RENDER_EXTERNAL_HOSTNAME: 'localhost'

const PORT = process.env.PORT
    ? process.env.PORT
    : 6835;

let app = express();
app.use(compression());
app.use(express.json());
app.use(await cors({ credentials: true }));

let pathNode = []

const addresses = process.env.PORT
    ? {
      listen: [
        `/ip4/0.0.0.0/tcp/${PORT}/wss`
      ],
      announce: [
        `/dns4/${process.env.RENDER_EXTERNAL_HOSTNAME}`,
        `/dns4/${process.env.RENDER_EXTERNAL_HOSTNAME}/wss`
      ]
    }
    : {
      listen: [
        `/ip4/0.0.0.0/tcp/${PORT}/ws`
      ],
      announce: [
        `/dns4/localhost/tcp/${PORT}`,
        `/dns4/localhost/tcp/${PORT}/ws`
      ]
    }

const libp2p = await createLibp2p({
  privateKey: peerId,
  addresses: addresses,
  transports: [
    webSockets({
      httpRequestHandler: (req, res) => {
        const isLibp2p = handled(req, res)
        if (isLibp2p) {
          return
        }
        app(req, res)
      }
    })
  ],
  connectionEncrypters: [noise()],
  streamMuxers: [yamux()],
  services: {
    identify: identify(),
    relay: circuitRelayServer(),
    ping: ping(),
    http: http(),
    pingHTTP: pingHTTP()
  }
})

libp2p.addEventListener('peer:discovery', (evt) => {
  console.log(`peer:discovery ${evt.detail.id.toString()}`)
})

// update peer connections
libp2p.addEventListener('connection:open', (event) => {
  console.log('connection:open', event.detail.remoteAddr.toString())
})

libp2p.addEventListener('connection:close', (event) => {
  console.log('connection:close', event.detail.remoteAddr.toString())
})

// update listening addresses
libp2p.addEventListener('self:peer:update', (event) => {
  // console.log('self:peer:update', event.detail)
})

let clients = [];

app.use('/assets', express.static(path.join(__dirname, '/public')));

function genUniqId() {
  return Date.now() + '-' + Math.floor(Math.random() * 1000000000);
}

function sendToAllUsers(data) {
  clients.forEach(client => {
    try {
      client.res.write(`data: ${JSON.stringify(data)}\n\n`);
      client.res.flush();
    } catch (error) {
      // Удаляем нерабочих клиентов
      clients = clients.filter(c => c.id !== client.id);
    }
  });
}

app.get('/clients', (req, res) => {
  res.json(clients.map((client) => client.id));
});

app.get('/peers', (req, res) => {
  let peers = []
  for (let item of libp2p.getPeers()) {
    peers.push(item.toString())
  }

  res.json({
    status: true,
    peers: peers,
    dhtMode: 'undefined',
    MA: libp2p.getMultiaddrs()
  });
  // libp2p.services.lanDHT.getMode()
});

app.get('/events', (req, res) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Access-Control-Allow-Origin': '*',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };

  const clientId = genUniqId();

  res.writeHead(200, headers);

  const sendData = `data: ${JSON.stringify({
    peerId: peerId.publicKey.toString()
  })}\n\n`;

  res.write(sendData);

  res.flush();

  const newClient = {
    id: clientId,
    res,
  };

  clients.push(newClient);

  console.log(`${clientId} - sse connection opened`, clients.length);

  req.on('close', () => {
    clients = clients.filter(client => client.id !== clientId);
    console.log(`${clientId} - Connection closed`, clients.length);
  });
});

libp2p.services.http.handle(HTTP_TEST_PROTOCOL, {
  handler: (req) => {
    return new Response('Hello World!')
  }
})

const handled = canHandle(libp2p)

console.info('Relay listening on:')

libp2p.getMultiaddrs().forEach(ma => {
  pathNode.push(ma.toString())
  console.info(ma.toString())
})

app.get('/{*splat}', async (req, res) => {
  res.status(200).send(await htmlResponse({libp2p, pathNode, PORT}));
})

// Функция очистки всех данных
async function cleanup() {
  console.log('Очистка данных сервера...');

  // Закрываем все соединения с клиентами SSE
  clients.forEach(client => {
    try {
      client.res.end();
    } catch (error) {
      console.error('Ошибка при закрытии соединения с клиентом:', error);
    }
  });
  clients = [];

  // Очищаем массив pathNode
  pathNode = [];

  // Останавливаем Libp2p узел
  if (libp2p) {
    console.log('Остановка Libp2p узла...');
    await libp2p.stop();
    console.log('Libp2p узел остановлен');
  }

  console.log('Очистка завершена');
}

// Обработчики событий завершения работы
process.on('SIGINT', async () => {
  console.log('\nПолучен SIGINT (Ctrl+C)');
  await cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Получен SIGTERM');
  await cleanup();
  process.exit(0);
});

process.on('beforeExit', async () => {
  console.log('Процесс завершает работу (beforeExit)');
  await cleanup();
});

process.on('uncaughtException', async (error) => {
  console.error('Необработанное исключение:', error);
  await cleanup();
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('Необработанный промис:', promise, 'причина:', reason);
  await cleanup();
  process.exit(1);
});

console.log(`Server running at http://localhost:${PORT}/`);
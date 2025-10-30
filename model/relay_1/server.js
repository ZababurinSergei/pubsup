/* eslint-disable no-console */

import { createServer } from 'node:http'
import { http } from '@libp2p/http'
import { pingHTTP } from '@libp2p/http-ping'
import { canHandle } from '@libp2p/http-server/node'
import { createLibp2p } from 'libp2p'
import { HTTP_TEST_PROTOCOL } from './common.js'
import peerData from '../../peerId.mjs'
import {identify} from "@libp2p/identify"
import {circuitRelayServer} from "@libp2p/circuit-relay-v2"
import {ping} from "@libp2p/ping"
import {webSockets} from "./websockets/dist/src/index.js"
import {noise} from "@chainsafe/libp2p-noise"
import {yamux} from "@chainsafe/libp2p-yamux"
import express from "express"
import compression from "compression"
import cors from "cors"
import {htmlResponse} from './htmlResponse.mjs'
import path from "path"
import process from "node:process"
import * as dotenv from "dotenv"

const __dirname = process.cwd();

dotenv.config();

const peerId = await peerData()

const RENDER_EXTERNAL_HOSTNAME = process.env.RENDER_EXTERNAL_HOSTNAME ? process.env.RENDER_EXTERNAL_HOSTNAME: 'localhost'

const PORT = process.env.PORT
    ? process.env.PORT
    : 6853;

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

// Система блокировки пиров
const blockedPeers = new Map();
const BLOCK_DURATION = 30000; // 30 секунд блокировки
const permanentBlockedPeers = new Set();

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

// Обработчик connection:open с проверкой блокировки
libp2p.addEventListener('connection:open', (event) => {
  const peerId = event.detail.remotePeer.toString();

  // Проверяем постоянную блокировку
  if (permanentBlockedPeers.has(peerId)) {
    console.log(`Rejecting connection from permanently blocked peer: ${peerId}`);
    event.detail.close().catch(() => {});
    return;
  }

  // Проверяем временную блокировку
  const blockedUntil = blockedPeers.get(peerId);
  if (blockedUntil && Date.now() < blockedUntil) {
    console.log(`Rejecting connection from temporarily blocked peer: ${peerId}`);
    event.detail.close().catch(() => {});
    return;
  }

  console.log('connection:open', event.detail.remoteAddr.toString());
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

// Эндпоинт для отключения конкретного пира
app.post('/peers/disconnect/:peerId', async (req, res) => {
  try {
    const { peerId } = req.params;

    if (!peerId) {
      return res.status(400).json({
        status: false,
        error: 'Peer ID is required'
      });
    }

    // Добавляем пира в список заблокированных
    blockedPeers.set(peerId, Date.now() + BLOCK_DURATION);
    console.log(`Blocked peer ${peerId} for ${BLOCK_DURATION}ms`);

    // Получаем все соединения
    const connections = libp2p.getConnections();

    // Находим соединения с указанным пиром
    const peerConnections = connections.filter(conn =>
        conn.remotePeer.toString() === peerId
    );

    if (peerConnections.length === 0) {
      return res.status(404).json({
        status: false,
        error: `Peer ${peerId} not found or not connected`
      });
    }

    // Закрываем все соединения с этим пиром
    const closePromises = peerConnections.map(conn => conn.close());
    await Promise.all(closePromises);

    console.log(`Disconnected from peer: ${peerId}`);

    // Удаляем из blockedPeers через указанное время
    setTimeout(() => {
      if (blockedPeers.has(peerId)) {
        blockedPeers.delete(peerId);
        console.log(`Unblocked peer: ${peerId}`);
      }
    }, BLOCK_DURATION);

    res.json({
      status: true,
      message: `Successfully disconnected from peer ${peerId}`,
      disconnectedConnections: peerConnections.length,
      blocked: true,
      blockDuration: BLOCK_DURATION
    });

  } catch (error) {
    console.error('Error disconnecting peer:', error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// Эндпоинт для отключения всех пиров
app.post('/peers/disconnect-all', async (req, res) => {
  try {
    // Получаем все активные соединения
    const connections = libp2p.getConnections();

    if (connections.length === 0) {
      return res.json({
        status: true,
        message: 'No active connections to disconnect',
        disconnectedCount: 0
      });
    }

    // Собираем информацию о пирах перед отключением
    const peerIds = [...new Set(connections.map(conn => conn.remotePeer.toString()))];

    // Добавляем всех пиров в список заблокированных
    peerIds.forEach(peerId => {
      blockedPeers.set(peerId, Date.now() + BLOCK_DURATION);
    });
    console.log(`Blocked ${peerIds.length} peers for ${BLOCK_DURATION}ms`);

    // Закрываем все соединения
    const closePromises = connections.map(conn => conn.close());
    await Promise.all(closePromises);

    console.log(`Disconnected from all peers. Total connections: ${connections.length}, Unique peers: ${peerIds.length}`);

    // Удаляем из blockedPeers через указанное время
    setTimeout(() => {
      peerIds.forEach(peerId => {
        if (blockedPeers.has(peerId)) {
          blockedPeers.delete(peerId);
          console.log(`Unblocked peer: ${peerId}`);
        }
      });
    }, BLOCK_DURATION);

    res.json({
      status: true,
      message: `Successfully disconnected from all peers`,
      disconnectedConnections: connections.length,
      disconnectedPeers: peerIds.length,
      peerIds: peerIds,
      blocked: true,
      blockDuration: BLOCK_DURATION
    });

  } catch (error) {
    console.error('Error disconnecting all peers:', error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// Эндпоинт для получения списка заблокированных пиров
app.get('/peers/blocked', (req, res) => {
  const blocked = Array.from(blockedPeers.entries()).map(([peerId, blockUntil]) => ({
    peerId,
    blockedUntil: new Date(blockUntil).toISOString(),
    timeRemaining: Math.max(0, blockUntil - Date.now())
  }));

  res.json({
    status: true,
    blockedPeers: blocked
  });
});

// Эндпоинт для получения информации о конкретном пире
app.get('/peers/:peerId', (req, res) => {
  try {
    const { peerId } = req.params;

    if (!peerId) {
      return res.status(400).json({
        status: false,
        error: 'Peer ID is required'
      });
    }

    const connections = libp2p.getConnections();
    const peerConnections = connections.filter(conn =>
        conn.remotePeer.toString() === peerId
    );

    if (peerConnections.length === 0) {
      return res.status(404).json({
        status: false,
        error: `Peer ${peerId} not found`
      });
    }

    const peerInfo = {
      peerId: peerId,
      connectionCount: peerConnections.length,
      connections: peerConnections.map(conn => ({
        id: conn.id,
        status: conn.status,
        remoteAddr: conn.remoteAddr.toString(),
        timeline: conn.timeline
      })),
      streams: peerConnections.flatMap(conn =>
          conn.streams.map(stream => ({
            id: stream.id,
            protocol: stream.protocol,
            direction: stream.direction
          }))
      ),
      blocked: blockedPeers.has(peerId),
      permanentlyBlocked: permanentBlockedPeers.has(peerId)
    };

    res.json({
      status: true,
      peer: peerInfo
    });

  } catch (error) {
    console.error('Error getting peer info:', error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// Эндпоинт для разблокировки пира
app.post('/peers/unblock/:peerId', async (req, res) => {
  try {
    const { peerId } = req.params;

    if (!peerId) {
      return res.status(400).json({
        status: false,
        error: 'Peer ID is required'
      });
    }

    if (blockedPeers.has(peerId)) {
      blockedPeers.delete(peerId);
      console.log(`Manually unblocked peer: ${peerId}`);

      res.json({
        status: true,
        message: `Peer ${peerId} has been unblocked`
      });
    } else {
      res.json({
        status: true,
        message: `Peer ${peerId} was not blocked`
      });
    }

  } catch (error) {
    console.error('Error unblocking peer:', error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// Эндпоинт для постоянной блокировки пира
app.post('/peers/block-permanent/:peerId', async (req, res) => {
  try {
    const { peerId } = req.params;

    if (!peerId) {
      return res.status(400).json({
        status: false,
        error: 'Peer ID is required'
      });
    }

    permanentBlockedPeers.add(peerId);

    // Закрываем существующие соединения
    const connections = libp2p.getConnections();
    const peerConnections = connections.filter(conn =>
        conn.remotePeer.toString() === peerId
    );

    if (peerConnections.length > 0) {
      const closePromises = peerConnections.map(conn => conn.close());
      await Promise.all(closePromises);
      console.log(`Closed ${peerConnections.length} connections from permanently blocked peer: ${peerId}`);
    }

    console.log(`Permanently blocked peer: ${peerId}`);

    res.json({
      status: true,
      message: `Peer ${peerId} permanently blocked`
    });

  } catch (error) {
    console.error('Error permanently blocking peer:', error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// Эндпоинт для снятия постоянной блокировки
app.post('/peers/unblock-permanent/:peerId', async (req, res) => {
  try {
    const { peerId } = req.params;

    if (!peerId) {
      return res.status(400).json({
        status: false,
        error: 'Peer ID is required'
      });
    }

    if (permanentBlockedPeers.has(peerId)) {
      permanentBlockedPeers.delete(peerId);
      console.log(`Removed permanent block for peer: ${peerId}`);

      res.json({
        status: true,
        message: `Peer ${peerId} removed from permanent block list`
      });
    } else {
      res.json({
        status: true,
        message: `Peer ${peerId} was not permanently blocked`
      });
    }

  } catch (error) {
    console.error('Error unblocking permanent peer:', error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// Эндпоинт для получения списка заблокированных пиров
app.get('/peers/blocked', (req, res) => {
  const blocked = Array.from(blockedPeers.entries()).map(([peerId, blockUntil]) => ({
    peerId,
    blockedUntil: new Date(blockUntil).toISOString(),
    timeRemaining: Math.max(0, blockUntil - Date.now()),
    type: 'temporary'
  }));

  const permanentlyBlocked = Array.from(permanentBlockedPeers).map(peerId => ({
    peerId,
    type: 'permanent'
  }));

  res.json({
    status: true,
    blockedPeers: blocked,
    permanentlyBlockedPeers: permanentlyBlocked
  });
});

// Обновленный эндпоинт для получения списка всех пиров с детальной информацией
app.get('/peers', (req, res) => {
  try {
    const connections = libp2p.getConnections();

    // Группируем соединения по пирам
    const peersMap = new Map();

    connections.forEach(conn => {
      const peerId = conn.remotePeer.toString();
      if (!peersMap.has(peerId)) {
        peersMap.set(peerId, []);
      }
      peersMap.get(peerId).push(conn);
    });

    const peers = Array.from(peersMap.entries()).map(([peerId, connections]) => {
      const streams = connections.flatMap(conn => conn.streams);

      return {
        peerId: peerId,
        connectionCount: connections.length,
        connections: connections.map(conn => ({
          id: conn.id,
          status: conn.status,
          remoteAddr: conn.remoteAddr.toString(),
          timeline: conn.timeline
        })),
        streamCount: streams.length,
        streams: streams.map(stream => ({
          id: stream.id,
          protocol: stream.protocol,
          direction: stream.direction
        })),
        blocked: blockedPeers.has(peerId),
        permanentlyBlocked: permanentBlockedPeers.has(peerId)
      };
    });

    res.json({
      status: true,
      totalPeers: peers.length,
      totalConnections: connections.length,
      peers: peers,
      dhtMode: 'undefined',
      MA: libp2p.getMultiaddrs()
    });

  } catch (error) {
    console.error('Error getting peers:', error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
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

  // Очищаем списки блокировок
  blockedPeers.clear();
  permanentBlockedPeers.clear();

  // Закрываем все p2p соединения
  if (libp2p) {
    console.log('Закрытие всех p2p соединений...');
    const connections = libp2p.getConnections();
    if (connections.length > 0) {
      const closePromises = connections.map(conn => conn.close());
      await Promise.all(closePromises);
      console.log(`Закрыто ${connections.length} p2p соединений`);
    }

    console.log('Остановка Libp2p узла...');
    await libp2p.stop();
    console.log('Libp2p узел остановлен');
  }

  // Очищаем массив pathNode
  pathNode = [];

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
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

const node = await createLibp2p({
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

let clients = [];


app.use('/pubsub', express.static(path.join(__dirname, '/docs')));
// app.use('/assets', express.static(path.join(__dirname, '/dist/assets')));
app.use('/assets', express.static(path.join(__dirname, '/public')));

app.get(`/`, async (req, res) => {
    res.status(200).send(await htmlResponse({node, pathNode, PORT}));
})



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
  for (let item of node.getPeers()) {
    peers.push(item.toString())
  }

  console.log('node.services.lanDHT', node.services.lanDHT)
  res.json({
    status: true,
    peers: peers,
    dhtMode: 'undefined',
    MA: node.getMultiaddrs()
  });
  // node.services.lanDHT.getMode()
});

// app.get('/events', (req, res) => {
//   const headers = {
//     'Content-Type': 'text/event-stream',
//     'Access-Control-Allow-Origin': '*',
//     'Connection': 'keep-alive',
//     'Cache-Control': 'no-cache'
//   };
//
//   res.writeHead(200, headers);
//
//   const sendData = `data: ${JSON.stringify({
//     peerId: peerId.toString()
//   })}\n\n`;
//
//   res.write(sendData);
//   res.flush();
//
//   const clientId = genUniqId();
//
//   const newClient = {
//     id: clientId,
//     res,
//   };
//
//   clients.push(newClient);
//
//   console.log(`${clientId} - Connection opened`);
//
//   req.on('close', () => {
//     console.log(`${clientId} - Connection closed`);
//     clients = clients.filter(client => client.id !== clientId);
//   });
// });


// register a handler function for the passed protocol - it will be served at
// the protocol id path by default
node.services.http.handle(HTTP_TEST_PROTOCOL, {
  handler: (req) => {
    return new Response('Hello World!')
  }
})

const handled = canHandle(node)

console.info('Relay listening on:')

node.getMultiaddrs().forEach(ma => {
  pathNode.push(ma.toString())
  console.info(ma.toString())
})

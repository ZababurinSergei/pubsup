/* eslint-disable no-console */

import { createServer } from 'node:http'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { http } from '@libp2p/http'
import { nodeServer } from '@libp2p/http-server'
import { tcp } from '@libp2p/tcp'
import express from 'express'
import { createLibp2p } from 'libp2p'
import peerData from '../../peerId.mjs'

const peerId = await peerData()
// this express app is where any business logic necessary to server HTTP
// resources will take place
const app = express()
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// this Node.js http.Server will receive incoming socket connections and convert
// them to HTTP requests - note that we don't need to call `server.listen` -
// libp2p will provide the networking layer
const server = createServer()
server.on('request', (req, res) => {
  console.log('dddddddddddddddddddddddddddddddddd')
  app(req, res)
})

const PORT = 8427
// create a libp2p node that listens on a TCP address
const node = await createLibp2p({
  privateKey: peerId,
  addresses: {
    listen: [
      `/ip4/127.0.0.1/tcp/${PORT}`
    ],
    announce: [
      `/dns4/localhost/tcp/${PORT}`,
      `/dns4/localhost/tcp/${PORT}/ws`
    ]
  },
  transports: [
    tcp()
  ],
  connectionEncrypters: [
    noise()
  ],
  streamMuxers: [
    yamux()
  ],
  services: {
    http: http({
      // allow injecting requests into the Node.js http.Server
      server: nodeServer(server)
    })
  }
})

await node.start()

console.info('Server listening on:')
node.getMultiaddrs().forEach(ma => {
  console.info(ma.toString())
})

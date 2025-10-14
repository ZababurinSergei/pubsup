/* eslint-disable no-console */

import { createServer } from 'node:http'
import { http } from '@libp2p/http'
import { authenticatedRoute } from '@libp2p/http/routes'
import { HTTP_PEER_ID_AUTH_PROTOCOL } from '@libp2p/http-peer-id-auth'
import { canHandle } from '@libp2p/http-server/node'
import { createLibp2p } from 'libp2p'
import peerData from '../../peerId.mjs'

const peerId = await peerData()
const PORT = 5429

const node = await createLibp2p({
  privateKey: peerId,
  services: {
    http: http()
  }
})

node.services.http.handle(HTTP_PEER_ID_AUTH_PROTOCOL, authenticatedRoute({
  path: '/auth',
  handler: (req, peerId) => {
    console.log('Client ID:', peerId.toString())

    return new Response('', {
      status: 200
    })
  }
}))

node.services.http.handle('/log-my-id/1', authenticatedRoute({
  path: '/log-my-id',
  handler: (req, peerId) => {
    console.log('Client ID:', peerId.toString())

    return new Response('', {
      status: 200
    })
  }
}))

const handled = canHandle(node)

const server = createServer()
server.on('request', (req, res) => {
  const isLibp2p = handled(req, res)
  console.log('isLibp2p', isLibp2p)
  if (isLibp2p) {
    return
  }

  res.statusCode = 404
  res.end()
})

server.listen(PORT, () => {
  console.info('Server listening on:')
  console.info(`http://127.0.0.1:${server.address().port}`)
  console.log('Server ID:', node.peerId.toString())
})

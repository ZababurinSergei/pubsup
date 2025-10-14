/* eslint-disable no-console */

import { http } from '@libp2p/http'
import { peerIdAuth } from '@libp2p/http/middleware'
import { createLibp2p } from 'libp2p'

const PORT = 5429
// create a libp2p node that can act as a client
const node = await createLibp2p({
  services: {
    http: http()
  }
})

const res = await node.services.http.fetch(`http://localhost:${PORT}/log-my-id`, {
  middleware: [
    peerIdAuth()
  ]
})

console.info('GET', res.url, res.status, res.statusText)
console.info(await res.text())

console.log('Client ID 2:', node.peerId.toString())
console.log('Server ID 2:', res.headers.get('x-libp2p-peer-id'))

/* eslint-disable no-console */

import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { circuitRelayServer } from '@libp2p/circuit-relay-v2'
import { identify } from '@libp2p/identify'
import { mplex } from '@libp2p/mplex'
import { webSockets } from '@libp2p/websockets'
import * as filters from '@libp2p/websockets/filters'
import { createLibp2p } from 'libp2p'
import { mdns } from '@libp2p/mdns'
import { webTransport } from '@libp2p/webtransport'

let libp2p = await createLibp2p({
  addresses: {
    listen: [
        '/ip4/0.0.0.0/tcp/0/ws'
    ]
  },
  transports: [
    webTransport(),
    webSockets({
      filter: filters.all
    })
  ],
  peerDiscovery: [
    mdns()
  ],
  connectionEncryption: [noise()],
  streamMuxers: [yamux(), mplex()],
  services: {
    identify: identify(),
    relay: circuitRelayServer({
      reservations: {
        maxReservations: Infinity
      }
    })
  },
  connectionManager: {
    minConnections: 0
  }
})

console.log('Relay listening on multiaddr(s): ', libp2p.getMultiaddrs().map((ma) => ma.toString()))

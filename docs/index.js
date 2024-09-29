import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { dcutr } from '@libp2p/dcutr'
import { identify, identifyPush } from '@libp2p/identify'
import { webRTC, webRTCDirect } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'
import * as filters from '@libp2p/websockets/filters'
import { multiaddr } from '@multiformats/multiaddr'
import { createLibp2p } from 'libp2p'
import { fromString, toString } from 'uint8arrays'
import { bootstrap } from '@libp2p/bootstrap'
import { kadDHT, removePrivateAddressesMapper, removePublicAddressesMapper } from '@libp2p/kad-dht'
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'
import { ping } from '@libp2p/ping'
import { PUBSUB_PEER_DISCOVERY, PORT, RENDER_EXTERNAL_HOSTNAME } from './constants.js'
import { FaultTolerance } from '@libp2p/interface-transport'
import { mplex } from '@libp2p/mplex'
import { PersistentPeerStore } from '@libp2p/peer-store'
import { IDBDatastore } from 'datastore-idb'

// const datastore = new IDBDatastore('/fs', {
//   prefix: '/universe',
//   version: 1
// })

// await datastore.destroy()
// await datastore.open()

const isLocalhost = window.location.hostname === 'localhost'
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const isBootstrap = urlParams.has('bootstrap')
const isLanKad = urlParams.has('lanKad')
const isDht = urlParams.has('dht')
const isPubsubPeerDiscovery = urlParams.has('pubsubPeerDiscovery')
const isPeerInfoMapper = urlParams.has('peerInfoMapper')
let publicAddressesMapper = removePublicAddressesMapper

let DhtProtocol = "/universe/kad/1.0.0"

console.log('isBootstrap', isBootstrap)
console.log('isPubsubPeerDiscovery', isPubsubPeerDiscovery)

const DOM = {
  peerId: () => document.getElementById('peer-id'),
  dhtMode: () => document.getElementById('dht-mode'),
  clearButton: () => document.getElementById('clear-button'),
  dialMultiaddrInput: () => document.getElementById('dial-multiaddr-input'),
  dialMultiaddrButton: () => document.getElementById('dial-multiaddr-button'),
  subscribeTopicInput: () => document.getElementById('subscribe-topic-input'),
  subscribeTopicButton: () => document.getElementById('subscribe-topic-button'),
  sendTopicMessageInput: () => document.getElementById('send-topic-message-input'),
  sendTopicMessageButton: () => document.getElementById('send-topic-message-button'),
  output: () => document.getElementById('output'),
  listeningAddressesList: () => document.getElementById('listening-addresses'),
  peerConnectionsList: () => document.getElementById('peer-connections'),
  topicPeerList: () => document.getElementById('topic-peers')
}

const appendOutput = (line) => {
  DOM.output().innerText += `${line}\n`
}
const clean = (line) => line.replaceAll('\n', '')

let boot = []

if(isBootstrap) {
  if(isPubsubPeerDiscovery) {
    boot = [
      pubsubPeerDiscovery({
        interval: 10000,
        topics: [PUBSUB_PEER_DISCOVERY], // defaults to ['_peer-discovery._p2p._pubsub']
        listenOnly: false
      }),
      bootstrap({
        list: [
          isLocalhost
              ? `/dns4/localhost/tcp/${PORT}/ws/p2p/12D3KooWAJKSV1yF6XVZRzMnh6YFd5tbXbQQZxwHAMxZXfWyQpm6`
              : `/dns4/relay-tuem.onrender.com/wss/p2p/12D3KooWAJKSV1yF6XVZRzMnh6YFd5tbXbQQZxwHAMxZXfWyQpm6`
        ]
      })
    ]
  } else {
    boot = [
      bootstrap({
        list: [
          isLocalhost
              ? `/dns4/localhost/tcp/${PORT}/ws/p2p/12D3KooWAJKSV1yF6XVZRzMnh6YFd5tbXbQQZxwHAMxZXfWyQpm6`
              : `/dns4/relay-tuem.onrender.com/wss/p2p/12D3KooWAJKSV1yF6XVZRzMnh6YFd5tbXbQQZxwHAMxZXfWyQpm6`
        ]
      })
    ]
  }
}

if(isPeerInfoMapper) {
  if(urlParams.get('peerInfoMapper') === 'public') {
    publicAddressesMapper = removePublicAddressesMapper
  } else if(urlParams.get('peerInfoMapper') === 'private') {
    publicAddressesMapper = removePrivateAddressesMapper
  } else {
    console.error('peerInfoMapper должно быть значение либо public либо private')
  }
}

if(isLanKad) {
  DhtProtocol = `${urlParams.get('lanKad')}kad/1.0.0`

  boot = [
    bootstrap({
      list: [
        '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
      ]
    })
  ]
}

const libp2p = await createLibp2p({
  // peerStore: PersistentPeerStore,
  // datastore: datastore,
  addresses: {
    listen: [
      '/webrtc-direct',
      '/webrtc'
    ]
  },
  transports: [
    webRTCDirect(),
    webSockets({
      filter: filters.all
    }),
    webRTC(),
    circuitRelayTransport({
      discoverRelays: 4
    })
  ],
  peerDiscovery: boot,
  connectionEncrypters: [noise()],
  streamMuxers: [yamux(), mplex()],
  connectionManager: {
    inboundConnectionThreshold: Infinity,
    maxConnections: Infinity
  },
  transportManager: {
    faultTolerance: FaultTolerance.NO_FATAL
  },
  services: {
    identify: identify(),
    identifyPush: identifyPush(),
    pubsub: gossipsub(),
    dcutr: dcutr(),
    ping: ping(),
    dht: kadDHT({
      kBucketSize: 4,
      kBucketSplitThreshold: `kBucketSize`,
      prefixLength: 6,
      clientMode: false,
      querySelfInterval: 5000,
      initialQuerySelfInterval: 1000,
      allowQueryWithZeroPeers: false,
      protocol: DhtProtocol,
      logPrefix: "libp2p:kad-dht",
      pingTimeout: 10000,
      pingConcurrency: 10,
      // maxInboundStreams: 32,
      // maxOutboundStreams: 64,
      maxInboundStreams: 3,
      maxOutboundStreams: 6,
      // peerInfoMapper: removePrivateAddressesMapper,
      peerInfoMapper: publicAddressesMapper,
    })
  },
  connectionGater: {
    denyDialPeer: (currentPeerId) => {
      console.log('-------- denyDialPeer --------', currentPeerId.toString())
      return false
    },
    denyDialMultiaddr: async (currentPeerId) => {
      console.log('-------- denyDialMultiaddr --------', currentPeerId.toString())
      return false
    },
    denyOutboundConnection: (currentPeerId, maConn) => {
      console.log('-------- 1 denyOutboundConnection 1 --------', currentPeerId.toString(), maConn)
      return false
    },
    denyOutboundEncryptedConnection: (currentPeerId, maConn) => {
      console.log('-------- 2 denyOutboundEncryptedConnection 2 --------', currentPeerId.toString(), maConn)
      return false
    },
    denyOutboundUpgradedConnection: (currentPeerId, maConn) => {
      console.log('-------- 3 denyOutboundUpgradedConnection 3 --------', currentPeerId.toString(), maConn)
      return false
    },
    denyInboundConnection: (maConn) => {
      console.log('-------- 1 denyInboundConnection 1 --------', maConn)
      return false
    },
    denyInboundEncryptedConnection: (currentPeerId, maConn) => {
      console.log('-------- 2 denyInboundEncryptedConnection 2 --------', currentPeerId.toString(), maConn)
      return false
    },
    denyInboundUpgradedConnection: (currentPeerId, maConn) => {
      console.log('-------- 3 denyInboundUpgradedConnection 3 --------', currentPeerId.toString(), maConn)
      return false
    },
    filterMultiaddrForPeer: async (currentPeerId, maConn) => {
      console.log('-------- filterMultiaddrForPeer --------', currentPeerId.toString(), maConn)
        return true
    }
  }
})

const intervalId = setInterval( () => {
  const ma = multiaddr(isLocalhost
      ? `/dns4/localhost/tcp/${PORT}/ws/p2p/12D3KooWAJKSV1yF6XVZRzMnh6YFd5tbXbQQZxwHAMxZXfWyQpm6`
      : `/dns4/relay-qcpn.onrender.com/wss/p2p/12D3KooWAJKSV1yF6XVZRzMnh6YFd5tbXbQQZxwHAMxZXfWyQpm6`)
  //
  // const peer = peerIdFromString('12D3KooWAyrwipbQChADmVUepf7N7Q7rJcwBQw3nb4TLcrLB2uJ1')

  libp2p.services.ping.ping(ma)
}, 1000 * 60 * 13)

if(isDht) {
  DOM.dhtMode().textContent = libp2p.services.dht.getMode()
} else {
  DOM.dhtMode().textContent = 'Disabled'
}

DOM.peerId().innerText = libp2p.peerId.toString()
console.log('multiaddress:',libp2p.getMultiaddrs())
function updatePeerList () {
  // Update connections list
  const peerList = libp2p.getPeers()
    .map(peerId => {
      const el = document.createElement('li')
      el.textContent = peerId.toString()
      const addrList = document.createElement('ul')
      for (const conn of libp2p.getConnections(peerId)) {
        const addr = document.createElement('li')

        let connection = conn.remoteAddr.toString().split(conn.multiplexer)
        connection = connection.length > 1
            ? `${conn.multiplexer}${connection[1]}`
            : connection[0]

        // console.log('------- Connections ------------', conn.multiplexer, conn.remoteAddr.toString().split(conn.multiplexer))
        addr.textContent = conn.remoteAddr.toString()

        addrList.appendChild(addr)
      }

      el.appendChild(addrList)

      return el
    })
  DOM.peerConnectionsList().replaceChildren(...peerList)
}

libp2p.addEventListener('peer:discovery', async (evt) => {
  console.log(`peer:discovery ${evt.detail.id.toString()}`)
  console.log(`peer:discovery `, evt.detail.multiaddrs)
  if(evt.detail.multiaddrs.length !== 0) {
    await libp2p.dial(evt.detail.multiaddrs)
  }
})

// update peer connections
libp2p.addEventListener('connection:open', (event) => {
  console.log('connection:open', event.detail.remoteAddr.toString())
  updatePeerList()
})

libp2p.addEventListener('connection:close', (event) => {
  console.log('connection:close', event.detail.remoteAddr.toString())
  updatePeerList()
})

// update listening addresses
libp2p.addEventListener('self:peer:update', (event) => {
  console.log('self:peer:update', event.detail)
  const multiaddrs = libp2p.getMultiaddrs()
    .map((ma) => {
      const el = document.createElement('li')
      el.textContent = ma.toString()
      el.onclick = (event) => {
        navigator.clipboard.writeText(event.currentTarget.textContent)
            .then(() => {})
            .catch((err) => console.error(err.name, err.message));
      }
      return el
    })
  DOM.listeningAddressesList().replaceChildren(...multiaddrs)
})

DOM.clearButton().onclick = async () => {
  DOM.dialMultiaddrInput().value = ''
}

// dial remote peer
DOM.dialMultiaddrButton().onclick = async () => {
  const ma = multiaddr(DOM.dialMultiaddrInput().value)
  appendOutput(`Dialing '${ma}'`)
  await libp2p.dial(ma)
  appendOutput(`Connected to '${ma}'`)
}

// subscribe to pubsub topic
DOM.subscribeTopicButton().onclick = async () => {
  const topic = DOM.subscribeTopicInput().value
  appendOutput(`Subscribing to '${clean(topic)}'`)

  libp2p.services.pubsub.subscribe(topic)

  DOM.sendTopicMessageInput().disabled = undefined
  DOM.sendTopicMessageButton().disabled = undefined
}

// send message to topic
DOM.sendTopicMessageButton().onclick = async () => {
  const topic = DOM.subscribeTopicInput().value
  const message = DOM.sendTopicMessageInput().value
  appendOutput(`Sending message '${clean(message)}'`)

  await libp2p.services.pubsub.publish(topic, fromString(message))
}

// update topic peers
setInterval(() => {
  const topic = DOM.subscribeTopicInput().value
  const peerList = libp2p.services.pubsub.getSubscribers(topic)
    .map(peerId => {
      const el = document.createElement('li')
      el.textContent = peerId.toString()
      return el
    })
  DOM.topicPeerList().replaceChildren(...peerList)
}, 500)

libp2p.services.pubsub.addEventListener('message', event => {
  const topic = event.detail.topic
  const message = toString(event.detail.data)

  console.log('------------ MESSAGE ------------', event.detail)
  appendOutput(`Message received on topic '${topic}'`)
  // appendOutput(message)
})

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
import { PersistentPeerStore } from '@libp2p/peer-store'
import { IDBDatastore } from 'datastore-idb'
import { ping } from '@libp2p/ping'
import { peerIdFromString } from '@libp2p/peer-id'

const store = new IDBDatastore('/fs', {
  prefix: '/universe',
  version: 1
})

await store.open()

const isLocalhost = window.location.hostname === 'localhost'

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const isBootstrap = urlParams.has('bootstrap')
const isLanKad = urlParams.has('lanKad')

const DOM = {
  peerId: () => document.getElementById('peer-id'),


  dhtMode: () => document.getElementById('dht-mode'),

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

// const services =  services: {
//   autoNAT: autoNAT(),
//       dcutr: dcutr(),
//       delegatedRouting: () => createDelegatedRoutingV1HttpApiClient('https://delegated-ipfs.dev'),
//       dht: kadDHT({
//     validators: {
//       ipns: ipnsValidator
//     },
//     selectors: {
//       ipns: ipnsSelector
//     }
//   }),
//       identify: identify({
//     agentVersion
//   }),
//       identifyPush: identifyPush({
//     agentVersion
//   }),
//       keychain: keychain(options.keychain),
//       ping: ping(),
//       relay: circuitRelayServer(),
//       upnp: uPnPNAT()
// }
const appendOutput = (line) => {
  DOM.output().innerText += `${line}\n`
}
const clean = (line) => line.replaceAll('\n', '')

let boot = []
console.log('isBootstrap', isBootstrap)
if(isBootstrap) {
  boot = [
    bootstrap({
      list: [
        isLocalhost
            ? "/dns4/localhost/tcp/4839/ws/p2p/12D3KooWAyrwipbQChADmVUepf7N7Q7rJcwBQw3nb4TLcrLB2uJ1"
            : "/dns4/relay-qcpn.onrender.com/wss/p2p/12D3KooWAyrwipbQChADmVUepf7N7Q7rJcwBQw3nb4TLcrLB2uJ1"
      ]
    })
  ]
}

if(isLanKad) {
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
  store,
  PersistentPeerStore,
  addresses: {
    listen: [
      '/webrtc-direct',
      '/webrtc'
    ]
  },
  transports: [
    webRTCDirect(),
    // the WebSocket transport lets us dial a local relay
    webSockets({
      // this allows non-secure WebSocket connections for purposes of the demo
      filter: filters.all
    }),
    // support dialing/listening on WebRTC addresses
    webRTC(),
    // support dialing/listening on Circuit Relay addresses
    circuitRelayTransport({
      // make a reservation on any discovered relays - this will let other
      // peers use the relay to contact us
      discoverRelays: 2
    })
  ],
  peerDiscovery: boot,
  // a connection encrypter is necessary to dial the relay
  connectionEncryption: [noise()],
  // a stream muxer is necessary to dial the relay
  streamMuxers: [yamux()],
  connectionGater: {
    denyDialPeer: (currentPeerId) => {
      // console.log('00000000000000 denyDialPeer 00000000000000',type, currentPeerId.toString())
      return false
    },
    denyDialMultiaddr: async (currentPeerId) => {
      // console.log('111111111111 denyDialMultiaddr 111111111111',type, currentPeerId.toString())
      return false
    },
    denyOutboundConnection: (currentPeerId, maConn) => {
      // console.log('####### 1 ####### denyOutboundConnection ##############',type, currentPeerId.toString())
      return false
    },
    denyOutboundEncryptedConnection: (currentPeerId, maConn) => {
      // console.log('####### 2 ####### denyOutboundEncryptedConnection ##############',type, currentPeerId.toString())
      return false
    },
    denyOutboundUpgradedConnection: (currentPeerId, maConn) => {
      // console.log('####### 3 ####### denyOutboundUpgradedConnection ##############', type, currentPeerId.toString())
      return false
    },
    denyInboundConnection: (maConn) => {
      // console.log('------- 1 ------- denyInboundConnection --------------', type, maConn.remoteAddr.toString())
      return false
    },
    denyInboundEncryptedConnection: (currentPeerId, maConn) => {
      // console.log('------- 2 ------- denyInboundEncryptedConnection --------------', type, currentPeerId.toString())
      return false
    },
    denyInboundUpgradedConnection: (currentPeerId, maConn) => {
      // console.log('------- 3 ------- denyInboundUpgradedConnection --------------', type, currentPeerId.toString())
      return false
    },
    filterMultiaddrForPeer: async (currentPeerId, multiaddr) => {
        return true
    }
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
      // protocol: '/ipfs/lan/kad/1.0.0',
      protocol: "/universe/kad/1.0.0",
      logPrefix: "libp2p:kad-dht",
      pingTimeout: 10000,
      pingConcurrency: 10,
      // maxInboundStreams: 32,
      // maxOutboundStreams: 64,
      maxInboundStreams: 3,
      maxOutboundStreams: 6,
      // peerInfoMapper: removePrivateAddressesMapper,
      peerInfoMapper: removePublicAddressesMapper,
    })
  },
  connectionManager: {
    minConnections: 20
  }
})

const intervalId = setInterval( () => {
  // const ma = multiaddr(isLocalhost
  //     ? "/dns4/localhost/tcp/4839/ws/p2p/12D3KooWAyrwipbQChADmVUepf7N7Q7rJcwBQw3nb4TLcrLB2uJ1"
  //     : "/dns4/relay-qcpn.onrender.com/wss/p2p/12D3KooWAyrwipbQChADmVUepf7N7Q7rJcwBQw3nb4TLcrLB2uJ1")

  const peer = peerIdFromString('12D3KooWAyrwipbQChADmVUepf7N7Q7rJcwBQw3nb4TLcrLB2uJ1')

  libp2p.services.ping.ping(peer)
}, 1000 * 60 * 13)

DOM.dhtMode().textContent = libp2p.services.dht.getMode()

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

libp2p.addEventListener('peer:discovery', (evt) => {
  console.log(`peer:discovery ${evt.detail.id.toString()}`)
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

  appendOutput(`Message received on topic '${topic}'`)
  appendOutput(message)
})

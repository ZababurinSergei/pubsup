import { createLibp2p } from 'libp2p';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { webSockets } from '@libp2p/websockets';
import { webRTC } from '@libp2p/webrtc';
import { identify } from '@libp2p/identify';
import { floodsub } from '@libp2p/floodsub';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { bootstrap } from '@libp2p/bootstrap';
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery';

const serverPeerId = '12D3KooWBHSGgQQNinaUn9mtx7iqfQSM3sb1Fr1aCnkqLnyeT88i';
const port = 6832;
const RENDER_EXTERNAL_HOSTNAME = 'relay-tuem.onrender.com';

export async function CreateLibp2p(mode = 'listener') {
    const isLocalhost = window.location.hostname === 'localhost';

    // Базовые адреса для прослушивания
    const listenAddresses = [
        '/p2p-circuit',
        '/webrtc'
    ];

    // Добавляем конкретные адреса для listener режима
    if (mode === 'listener') {
        if (isLocalhost) {
            listenAddresses.push(`/ip4/0.0.0.0/tcp/${port}/ws`);
        } else {
            listenAddresses.push(`/dns4/${RENDER_EXTERNAL_HOSTNAME}/wss/p2p/${serverPeerId}`);
        }
    }

    // Bootstrap пиры для discovery
    const bootstrapList = [
        isLocalhost
            ? `/dns4/localhost/tcp/${port}/ws/p2p/${serverPeerId}`
            : `/dns4/${RENDER_EXTERNAL_HOSTNAME}/wss/p2p/${serverPeerId}`
    ];

    const libp2p = await createLibp2p({
        addresses: {
            listen: [
                '/p2p-circuit',
                '/webrtc'
            ]
        },
        transports: [
            webSockets(),
            webRTC(),
            circuitRelayTransport({
                // Резервируем слоты на релеях для входящих соединений
                discoverRelays: 1,
                reservationConcurrency: 1
            })
        ],
        connectionEncrypters: [noise()],
        streamMuxers: [yamux()],
        peerDiscovery: [
            bootstrap({
                list: bootstrapList,
                timeout: 1000
            }),
            pubsubPeerDiscovery({
                interval: 10000,
                topics: ['_peer-discovery._p2p._pubsub'],
                listenOnly: false
            })
        ],
        services: {
            identify: identify(),
            pubsub: gossipsub({
                emitSelf: false,
                canRelayMessage: true,
                doPX: true
            })
        },
        connectionManager: {
            minConnections: 1,
            maxConnections: 50,
            autoDial: true
        },
        connectionGater: {
            denyDialMultiaddr: () => false,
            denyDialPeer: () => false,
            denyInboundConnection: () => false,
            denyOutboundConnection: () => false,
            denyInboundEncryptedConnection: () => false,
            denyOutboundEncryptedConnection: () => false,
            denyInboundUpgradedConnection: () => false,
            denyOutboundUpgradedConnection: () => false
        }
    });

    await libp2p.start();

    console.log(`Libp2p ${mode} запущен с PeerID:`, libp2p.peerId.toString());
    console.log('Адреса прослушивания:', libp2p.getMultiaddrs().map(ma => ma.toString()));

    return libp2p;
}
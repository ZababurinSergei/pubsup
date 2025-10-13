import path from 'path';
import process from "node:process";
import cors from 'cors';
import Enqueue from 'express-enqueue';
import compression from 'compression';
import * as dotenv from 'dotenv';
import express from 'express';
import {http} from '@libp2p/http'
import {nodeServer} from '@libp2p/http-server'
import {createServer} from 'node:http'
import {kadDHT, removePublicAddressesMapper, removePrivateAddressesMapper} from '@libp2p/kad-dht'
/* eslint-disable no-console */
import {privateKeyFromRaw, generateKeyPair, privateKeyToProtobuf, privateKeyFromProtobuf} from '@libp2p/crypto/keys'
import {peerIdFromPrivateKey} from '@libp2p/peer-id'
import {noise} from '@chainsafe/libp2p-noise'
import {yamux} from '@chainsafe/libp2p-yamux'
import {circuitRelayServer} from '@libp2p/circuit-relay-v2'
import {identify, identifyPush} from '@libp2p/identify'
import {webSockets} from '@libp2p/websockets'
import {createLibp2p} from 'libp2p'
import {tcp} from '@libp2p/tcp'
import * as createEd25519PeerId from '@libp2p/peer-id-factory'
import {webTransport} from '@libp2p/webtransport'
import fs from "node:fs";
import {persistentPeerStore} from '@libp2p/peer-store'
import {MemoryDatastore} from 'datastore-core'
import {ping} from "@libp2p/ping";
import {PUBSUB_PEER_DISCOVERY} from './docs/constants.js'
import {gossipsub} from '@chainsafe/libp2p-gossipsub'
import {autoNATv2} from '@libp2p/autonat-v2'

// const datastore = new MemoryDatastore()
let __dirname = process.cwd();
const RENDER_EXTERNAL_HOSTNAME = process.env.RENDER_EXTERNAL_HOSTNAME ? process.env.RENDER_EXTERNAL_HOSTNAME: 'localhost'
// Путь для сохранения приватного ключа
const PRIVATE_KEY_PATH = path.join(process.cwd(), 'private-key.proto');

const peerId = await getOrCreatePrivateKey();

console.log('RENDER_EXTERNAL_HOSTNAME', RENDER_EXTERNAL_HOSTNAME)
/**
 * Сохраняет приватный ключ на диск
 * @param {Uint8Array} privateKey - Приватный ключ в бинарном формате
 * @returns {Promise<boolean>} - Успешно ли сохранен ключ
 */
async function savePrivateKey(privateKey) {
    try {
        // Конвертируем приватный ключ в protobuf формат
        const privateKeyProto = privateKeyToProtobuf(privateKey);

        // Сохраняем на диск
        fs.writeFileSync(PRIVATE_KEY_PATH, privateKeyProto);
        console.log('Приватный ключ успешно сохранен:', PRIVATE_KEY_PATH);
        return true;
    } catch (error) {
        console.error('Ошибка при сохранении приватного ключа:', error);
        return false;
    }
}

/**
 * Читает приватный ключ с диска
 * @returns {Promise<Uint8Array|null>} - Приватный ключ или null если ошибка
 */
async function readPrivateKey() {
    try {
        // Проверяем существует ли файл
        if (!fs.existsSync(PRIVATE_KEY_PATH)) {
            console.log('Файл приватного ключа не найден:', PRIVATE_KEY_PATH);
            return null;
        }

        // Читаем файл
        const buffer = fs.readFileSync(PRIVATE_KEY_PATH);

        // Конвертируем из protobuf обратно в приватный ключ
        const privateKey = privateKeyFromProtobuf(buffer);
        console.log('Приватный ключ успешно загружен с диска');
        return privateKey;
    } catch (error) {
        console.error('Ошибка при чтении приватного ключа:', error);
        return null;
    }
}

/**
 * Генерирует и сохраняет новый приватный ключ, если его нет
 * @returns {Promise<Uint8Array>} - Существующий или новый приватный ключ
 */
async function getOrCreatePrivateKey() {
    // Пытаемся прочитать существующий ключ
    let privateKey = await readPrivateKey();

    // Если ключа нет, генерируем новый и сохраняем
    if (!privateKey) {
        console.log('Генерация нового приватного ключа...');
        const {generateKeyPair} = await import('@libp2p/crypto/keys');
        privateKey = await generateKeyPair('Ed25519');

        // Сохраняем новый ключ
        await savePrivateKey(privateKey);
    }

    return privateKey;
}

// const buffer = fs.readFileSync(__dirname + '/peerId.proto')
// const peerId = await createEd25519PeerId.createFromProtobuf(buffer)

//TODO надо вставить
/*
const peerId = privateKeyFromProtobuf(buffer)
// const writePeerId = async (name) => {
//     let peerId = await generateKeyPair('Ed25519')
//     fs.writeFileSync(__dirname + name, privateKeyToProtobuf(peerId))
//     return peerId
// }
// const readPeerId = async (name) => {
//     const buffer = fs.readFileSync(__dirname + name)
//     return privateKeyFromProtobuf(buffer)
// }
// console.log('__dirname + namePeerId', __dirname + namePeerId)
// const peerId = fs.existsSync(__dirname + namePeerId) && isRead ? await readPeerId(namePeerId) :await writePeerId(namePeerId)
 */

dotenv.config();

const port = process.env.PORT
    ? process.env.PORT
    : 4839;

let whitelist = []

let app = express();
const server = createServer(app);

app.use(compression());
app.use(express.json());

const queue = new Enqueue({
    concurrentWorkers: 4,
    maxSize: 200,
    timeout: 30000
});

app.use(await cors({credentials: true}));
app.use(queue.getMiddleware());

let corsOptions = {
    origin: function (origin, callback) {
        console.log('origin', origin);
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use('/pubsub', express.static(path.join(__dirname, '/docs')));
// app.use('/assets', express.static(path.join(__dirname, '/dist/assets')));
app.use('/assets', express.static(path.join(__dirname, '/public')));

app.get(`/env.json`, async (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'env.json'))
})

app.get(`/env.mjs`, async (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'env.mjs'))
})

app.get(`/`, async (req, res) => {

    const html = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Relay Node</title>
    <meta name="description" content="Relay Node Information Dashboard">
    <link rel="shortcut icon" href="data:image/png;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbbv+DGW3/mRlt/5kZbf+ZGq6/hIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGa3/ohkt/7/Zbj//2S3/v9lt/6WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGm5/iRlt/74Zbj//2W4//9luP//Zbf++mi4/i4gIPciGhr24hsb9uwbG/bsGhr24CEh9xoAAAAAAAAAAAAAAABnuP5mZLf+/2W4//9luP//Zbj//2S3/v9muP5yGBj2rhMT9v8TE/b/ExP2/xMT9f8YGPWkAAAAAAAAAAAAAAAAb7z/BGW3/tZluP//Zbj//2W4//9lt/7gJzH3ShMT9f8TE/b/ExP2/xMT9v8TE/b/ExP1/CAg9joAAAAAAAAAAAAAAABmuP5GZLf+6GS3/uhkt/7oZbf+UhgY9YQSEvX/ExP2/xMT9v8TE/b/ExP2/xIS9f8aGvZ8AAAAAD4++gQgIPZ6IiL2hiIi9oYgIPZ8KCj5BAAAAAAtLfgUFBT17BMT9v8TE/b/ExP2/xMT9v8VFfXoLCz4DgAAAAAaGvZqEhL1/xMT9v8TE/b/EhL1/xsb9nIAAAAAAAAAABwc9m4SEvX/ExP2/xMT9v8SEvX/HR32ZAAAAAAnJ/gSFRX16hMT9v8TE/b/ExP2/xMT9v8UFPXuJyf4Fp2xlAKNnqUYLC/mfhYW83ATE/VuFxf1aDc3+gIAAAAAGBj1fhIS9f8TE/b/ExP2/xMT9v8TE/b/ExP1/xkZ9YaGn3yIhZ57/4Wee/+Gn3yKAAAAAAAAAAAAAAAAAAAAACMj9zYTE/X8ExP2/xMT9v8TE/b/ExP2/xMT9f9JUshihZ57+IaffP+Gn3z/hZ579oigfiYAAAAAAAAAAAAAAAAAAAAAGBj1oBIS9f8TE/b/ExP2/xMT1f8YGPWmiKB+PIWee/+Gn3z/hp98/4Wee/+HoH06AAAAAAAAAAAAAAAAAAAAACUl9xgVFfXOExP11BMT9dQUFPXQJib3HgAAAACGn3ymhp98/4affP+Gn3ymAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiKB+EIihf0CIoX9AiKB+EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AADg/wAA4MMAAOCBAADggQAA8QEAAOeBAADDwwAAgf8AAIAPAACBDwAAgQ8AAMMPAAD//wAA//8AAA==" type="image/png">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            background: rgba(255, 255, 255, 0.95);
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .logo {
            width: 80px;
            height: 80px;
            margin-bottom: 15px;
        }
        
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.95);
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .card h3 {
            color: #4a5568;
            margin-bottom: 15px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 8px;
        }
        
        .info-grid {
            display: grid;
            gap: 10px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f1f1f1;
        }
        
        .info-label {
            font-weight: 600;
            color: #4a5568;
            display: flex;
            width: 7dvw;
            

        }
        
        .info-value {
            font-family: 'Courier New', monospace;
            background: #f7fafc;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9em;
            word-break: break-all;
            // max-width: 60%;
            text-align: right;
        }
        
        .copy-btn {
            background: #4299e1;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8em;
            margin-left: 8px;
            transition: background 0.3s;
            height: fit-content;
            align-self: center;
        }
        
        .copy-btn:hover {
            background: #3182ce;
        }
        
        .copy-btn.copied {
            background: #48bb78;
        }
        
        .status-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 8px;
        }
        
        .status-online {
            background: #48bb78;
        }
        
        .status-offline {
            background: #f56565;
        }
        
        .peers-list {
            max-height: 300px;
            overflow-y: auto;
        }
        
        .peer-item {
            background: #f7fafc;
            padding: 10px;
            margin: 5px 0;
            border-radius: 6px;
            border-left: 4px solid #4299e1;
            font-family: 'Courier New', monospace;
            font-size: 0.85em;
            word-break: break-all;
        }
        
        .actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 15px;
        }
        
        .btn {
            background: #4299e1;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9em;
            transition: all 0.3s;
        }
        
        .btn:hover {
            background: #3182ce;
            transform: translateY(-2px);
        }
        
        .btn-secondary {
            background: #718096;
        }
        
        .btn-secondary:hover {
            background: #4a5568;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .stat-item {
            text-align: center;
            padding: 15px;
            background: #f7fafc;
            border-radius: 8px;
        }
        
        .stat-value {
            font-size: 1.5em;
            font-weight: bold;
            color: #4299e1;
        }
        
        .stat-label {
            font-size: 0.8em;
            color: #718096;
            margin-top: 5px;
        }
        
        .refresh-info {
            text-align: center;
            color: #718096;
            font-size: 0.8em;
            margin-top: 10px;
        }
        
        .full-width {
            grid-column: 1 / -1;
              margin-bottom: 20px;
    }
        
        @media (max-width: 768px) {
            .dashboard {
                grid-template-columns: 1fr;
            }
            
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .info-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
            }
            
            .info-value {
                max-width: 100%;
                text-align: left;
            }
        }
        
        .container_peer_id {
            display: flex;
            width: 100%;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="./assets/logo.png" alt="Logo" class="logo">
            <h1>Relay Node</h1>
            <p>Real-time information and monitoring dashboard</p>
        </div>
        
        <div class="dashboard">
            <div class="card">
                <h3>🆔 Node Identity</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Peer ID:</span>
                        <div class="container_peer_id">
                            <span class="info-value" id="peerId">${node.peerId.publicKey.toString()}</span>
                            <button class="copy-btn" onclick="copyToClipboard('peerId')">Copy</button>
                        </div>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Node Status:</span>
                        <span class="info-value">
                            <span class="status-indicator status-online"></span>
                            <span id="nodeStatus">Online</span>
                        </span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Process ID:</span>
                        <span class="info-value" id="processId">${process.pid}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Port:</span>
                        <span class="info-value" id="nodePort">${port}</span>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>🌐 Network Addresses</h3>
                <div class="info-grid" id="addressesList">
                    ${node.getMultiaddrs().map((addr, index) =>
        `<div class="info-item">
                            <span class="info-label">Address ${index + 1}:</span>
                            <span class="info-value address-item">${addr.toString()}</span>
                        </div>`
    ).join('')}
                </div>
            </div>
            
            <div class="card">
                <h3>📊 Node Statistics</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-value" id="peersCount">${node.getPeers().length}</div>
                        <div class="stat-label">Connected Peers</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="clientsCount">0</div>
                        <div class="stat-label">SSE Clients</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="dhtMode">${node.services.lanDHT?.getMode() || 'Unknown'}</div>
                        <div class="stat-label">DHT Mode</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="uptime">0s</div>
                        <div class="stat-label">Uptime</div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>🔧 Services & Protocols</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">DHT (LAN):</span>
                        <span class="status-indicator status-online"></span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">DHT (Amino):</span>
                        <span class="status-indicator status-online"></span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Circuit Relay:</span>
                        <span class="status-indicator status-online"></span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">PubSub:</span>
                        <span class="status-indicator status-online"></span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">AutoNAT:</span>
                        <span class="status-indicator status-online"></span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Identify:</span>
                        <span class="status-indicator status-online"></span>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>🔄 Transports</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">WebTransport:</span>
                        <span class="status-indicator status-online"></span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">WebSockets:</span>
                        <span class="status-indicator status-online"></span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">TCP:</span>
                        <span class="status-indicator status-online"></span>
                    </div>
                </div>
            </div>
            
             <div class="card">
            <h3>📝 Node Information</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Start Time:</span>
                    <span class="info-value" id="startTime">${new Date().toLocaleString()}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Environment:</span>
                    <span class="info-value">${process.env.NODE_ENV || 'development'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Version:</span>
                    <span class="info-value" id="libp2pVersion">Loading...</span>
                </div>
            </div>
        </div>
        </div>
        
        <div class="card full-width">
            <h3>👥 Connected Peers</h3>
            <div class="actions">
                <button class="btn" onclick="refreshPeers()">🔄 Refresh Peers</button>
                <button class="btn btn-secondary" onclick="copyAllAddresses()">📋 Copy All Addresses</button>
                <button class="btn" onclick="exportNodeInfo()">💾 Export Node Info</button>
            </div>
            <div class="peers-list" id="peersList">
                ${node.getPeers().length > 0
        ? node.getPeers().map(peer =>
            `<div class="peer-item">${peer.toString()}</div>`
        ).join('')
        : '<div class="refresh-info">No peers connected</div>'
    }
            </div>
        </div>
        
        <div class="card">
            <h3>📡 Bootstrap Address</h3>
            <div class="info-item">
                <span class="info-label">Primary Address:</span>
                <div>
                    <span class="info-value" id="primaryAddress">${pathNode}</span>
                    <button class="copy-btn" onclick="copyToClipboard('primaryAddress')">Copy</button>
                </div>
            </div>
            <div class="refresh-info">Use this address to connect other nodes to this relay</div>
        </div>
    </div>

    <script>
        let nodeData = {};
        let startTime = Date.now();
        
        // Utility functions
        function copyToClipboard(elementId) {
            const element = document.getElementById(elementId);
            const text = element.textContent || element.innerText;
            navigator.clipboard.writeText(text).then(() => {
                
                // const btn = event.target;
                // const originalText = btn.textContent;
                // btn.textContent = '✓ Copied!';
                // btn.classList.add('copied');
                
                // setTimeout(() => {
                    // btn.textContent = originalText;
                    // btn.classList.remove('copied');
                // }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy to clipboard');
            });
        }
        
        function copyAllAddresses() {
            const addresses = Array.from(document.querySelectorAll('.address-item'))
                .map(item => item.textContent)
                .join('\\n');
            
            if (addresses) {
                navigator.clipboard.writeText(addresses).then(() => {
                    showNotification('All addresses copied to clipboard!');
                });
            }
        }
        
        function exportNodeInfo() {
            const nodeInfo = {
                peerId: document.getElementById('peerId').textContent,
                addresses: Array.from(document.querySelectorAll('.address-item')).map(item => item.textContent),
                peers: Array.from(document.querySelectorAll('.peer-item')).map(item => item.textContent),
                statistics: {
                    peersCount: document.getElementById('peersCount').textContent,
                    clientsCount: document.getElementById('clientsCount').textContent,
                    dhtMode: document.getElementById('dhtMode').textContent,
                    uptime: document.getElementById('uptime').textContent
                },
                exportTime: new Date().toISOString()
            };
            
            const dataStr = JSON.stringify(nodeInfo, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = \`node-info-\${new Date().toISOString().split('T')[0]}.json\`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showNotification('Node information exported!');
        }
        
        function showNotification(message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.style.cssText = \`
                position: fixed;
                top: 20px;
                right: 20px;
                background: #48bb78;
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                font-size: 0.9em;
            \`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
        
        function formatUptime() {
            const seconds = Math.floor((Date.now() - startTime) / 1000);
            const days = Math.floor(seconds / 86400);
            const hours = Math.floor((seconds % 86400) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            
            if (days > 0) return \`\${days}d \${hours}h \${minutes}m\`;
            if (hours > 0) return \`\${hours}h \${minutes}m \${secs}s\`;
            if (minutes > 0) return \`\${minutes}m \${secs}s\`;
            return \`\${secs}s\`;
        }
        
        // Data fetching functions
        async function refreshPeers() {
            try {
                const response = await fetch('/peers');
                const data = await response.json();
                nodeData = data;
                updateDashboard();
                showNotification('Peers list updated');
            } catch (error) {
                console.error('Error fetching peers:', error);
                showNotification('Error updating peers list');
            }
        }
        
        async function refreshClients() {
            try {
                const response = await fetch('/clients');
                const clients = await response.json();
                document.getElementById('clientsCount').textContent = clients.length;
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        }
        
        function updateDashboard() {
            // Update peers count and list
            if (nodeData.peers) {
                document.getElementById('peersCount').textContent = nodeData.peers.length;
                
                const peersList = document.getElementById('peersList');
                if (nodeData.peers.length > 0) {
                    peersList.innerHTML = nodeData.peers.map(peer => 
                        \`<div class="peer-item">\${peer}</div>\`
                    ).join('');
                } else {
                    peersList.innerHTML = '<div class="refresh-info">No peers connected</div>';
                }
            }
            
            // Update DHT mode
            if (nodeData.dhtMode) {
                document.getElementById('dhtMode').textContent = nodeData.dhtMode;
            }
        }
        
        // SSE connection for real-time updates
        function setupEventSource() {
            const events = new EventSource('/events');
            
            events.onmessage = (event) => {
                const data = JSON.parse(event.data);
                // Peer ID уже установлен на сервере, но обновляем если приходит новый
                if (data.peerId && data.peerId !== document.getElementById('peerId').textContent) {
                // console.log('ddddddddddddd', data.peerId.publicKey.toString())
                //     document.getElementById('peerId').textContent = data.peerId.publicKey.toString();
                }
            };
            
            events.onerror = (err) => {
                console.log('SSE connection error:', err);
                document.getElementById('nodeStatus').textContent = 'Connection Issues';
                document.querySelector('#nodeStatus').previousElementSibling.className = 'status-indicator status-offline';
                
                // Attempt reconnect after 5 seconds
                setTimeout(setupEventSource, 5000);
            };
        }
        
        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', function() {
            setupEventSource();
            refreshClients();
            
            // Set libp2p version (this would need to be passed from server)
            document.getElementById('libp2pVersion').textContent = '3.0.6';
            
            // Update uptime every second
            setInterval(() => {
                document.getElementById('uptime').textContent = formatUptime();
            }, 1000);
            
            // Refresh data every 30 seconds
            setInterval(() => {
                refreshPeers();
                refreshClients();
            }, 30000);
        });
    </script>
</body>
</html>`;
    res.status(200).send(html);
    // res.status(200).sendFile(path.join(__dirname, '/index.html'));
});

// app.post(`/*`, async (req, res) => {
//     console.log('==== POST ====', req.path);
// });

app.use(queue.getErrorMiddleware());

let addresses = process.env.PORT
    ? {
        listen: [
            `/ip4/0.0.0.0/tcp/${port}/wss`
        ],
        announce: [
            `/dns4/${process.env.RENDER_EXTERNAL_HOSTNAME}`,
            `/dns4/${process.env.RENDER_EXTERNAL_HOSTNAME}/wss`
        ]
    }
    : {
        listen: [
            `/ip4/0.0.0.0/tcp/${port}/ws`
        ],
        announce: [
            `/dns4/localhost/tcp/${port}`,
            `/dns4/localhost/tcp/${port}/ws`
        ]
    }

const node = await createLibp2p({
    privateKey: peerId,
    addresses: addresses,
    transports: [
        webTransport(),
        webSockets(),
        tcp(),
    ],
    connectionEncryption: [
        noise()
    ],
    streamMuxers: [yamux()],
    services: {
        identify: identify(),
        identifyPush: identifyPush(),
        pubsub: gossipsub(),
        autoNAT: autoNATv2(),
        relay: circuitRelayServer(),
        ping: ping(),
        http: http({
            server: nodeServer(app)
        }),
        lanDHT: kadDHT({
            protocol: '/ipfs/lan/kad/1.0.0',
            peerInfoMapper: removePublicAddressesMapper,
            clientMode: false,
            logPrefix: 'libp2p:dht-lan',
            datastorePrefix: '/dht-lan',
            metricsPrefix: 'libp2p_dht_lan'
        }),
        aminoDHT: kadDHT({
            protocol: '/ipfs/kad/1.0.0',
            peerInfoMapper: removePrivateAddressesMapper,
            logPrefix: 'libp2p:dht-amino',
            datastorePrefix: '/dht-amino',
            metricsPrefix: 'libp2p_dht_amino'
        })
    }
})

node.services.pubsub.subscribe(PUBSUB_PEER_DISCOVERY)
console.log(`Node started with id ${node.peerId.toString()}`)
let pathNode = ''

node.getMultiaddrs().forEach((ma, index) => {
    pathNode = ma.toString()
    console.log(`${index}::Listening on:`, pathNode)
})

let clients = [];
let todoState = [];

app.get('/state', (req, res) => {
    res.json(todoState);
});

app.get('/events', (req, res) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };

    res.writeHead(200, headers);

    const sendData = `data: ${JSON.stringify({
        peerId: peerId.toString()
    })}\n\n`;

    res.write(sendData);
    res.flush();

    const clientId = genUniqId();

    const newClient = {
        id: clientId,
        res,
    };

    clients.push(newClient);

    console.log(`${clientId} - Connection opened`);

    req.on('close', () => {
        console.log(`${clientId} - Connection closed`);
        clients = clients.filter(client => client.id !== clientId);
    });
});

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
        dhtMode: node.services.lanDHT.getMode(),
        MA: node.getMultiaddrs()
    });
});

app.post('/add-task', (req, res) => {
    const addedText = req.body.text;
    todoState = [
        {id: genUniqId(), text: addedText, checked: false},
        ...todoState
    ];
    res.json(null);
    sendToAllUsers();
});

app.post('/check-task', (req, res) => {
    const id = req.body.id;
    const checked = req.body.checked;

    todoState = todoState.map((item) => {
        if (item.id === id) {
            return {...item, checked};
        } else {
            return item;
        }
    });
    res.json(null);
    sendToAllUsers();
});

app.post('/del-task', (req, res) => {
    const id = req.body.id;
    todoState = todoState.filter((item) => {
        return item.id !== id;
    });

    res.json(null);
    sendToAllUsers();
});

server.listen(port, RENDER_EXTERNAL_HOSTNAME, () => {
    console.log('pid: ', process.pid);
    console.log(`Server running at http://localhost:${port}/`);
})

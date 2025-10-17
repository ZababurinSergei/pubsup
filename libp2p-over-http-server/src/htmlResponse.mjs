import process from "node:process";

export const htmlResponse = async ({libp2p, pathNode, PORT}) => {

    return `<!DOCTYPE html>
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
            margin: 20px 0;
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
            justify-content: flex-start;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f1f1f1;
            overflow-x: hidden;
            gap: 8px;
        }
        
        .info-label {
            font-weight: 600;
            color: #4a5568;
            display: flex;
            width: 7dvw;
            display: flex;
            flex-wrap: nowrap;
            min-width: fit-content;
        }
        
        .info-value {
            font-family: 'Courier New', monospace;
            background: #f7fafc;
            border-radius: 4px;
            font-size: 0.9em;
            text-align: right;
            display: flex;
            flex-direction: row;
            align-items: center;
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
            min-width: 5dvw;
            box-sizing: border-box;
            min-height: 1.5dvw;
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
            padding: 15px;
            margin: 8px 0;
            border-radius: 8px;
            border-left: 4px solid #4299e1;
            font-family: 'Courier New', monospace;
            font-size: 0.85em;
            word-break: break-all;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        }
        
        .peer-info {
            flex: 1;
            word-break: break-all;
        }
        
        .peer-actions {
            display: flex;
            gap: 8px;
            flex-shrink: 0;
        }
        
        .peer-btn {
            background: #4299e1;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.75em;
            transition: all 0.3s;
            white-space: nowrap;
        }
        
        .peer-btn:hover {
            transform: translateY(-1px);
        }
        
        .peer-btn-info {
            background: #38a169;
        }
        
        .peer-btn-info:hover {
            background: #2f855a;
        }
        
        .peer-btn-danger {
            background: #e53e3e;
        }
        
        .peer-btn-danger:hover {
            background: #c53030;
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
        
        .btn-danger {
            background: #e53e3e;
        }
        
        .btn-danger:hover {
            background: #c53030;
        }
        
        .btn-success {
            background: #38a169;
        }
        
        .btn-success:hover {
            background: #2f855a;
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
        
        .peer-management {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
        }
        
        .peer-form {
            background: #f7fafc;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
        }
        
        .form-group {
            margin-bottom: 10px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #4a5568;
        }
        
        .form-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #cbd5e0;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.85em;
        }
        
        .form-input:focus {
            outline: none;
            border-color: #4299e1;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }
        
        .form-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .response-area {
            margin-top: 15px;
            padding: 10px;
            background: #edf2f7;
            border-radius: 6px;
            border-left: 4px solid #4299e1;
            font-family: 'Courier New', monospace;
            font-size: 0.8em;
            white-space: pre-wrap;
            max-height: 200px;
            overflow-y: auto;
        }
        
        .response-success {
            border-left-color: #48bb78;
            background: #f0fff4;
        }
        
        .response-error {
            border-left-color: #f56565;
            background: #fff5f5;
        }
        
        .hidden {
            display: none;
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
            
            .actions {
                flex-direction: column;
            }
            
            .form-actions {
                flex-direction: column;
            }
            
            .peer-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
            
            .peer-actions {
                width: 100%;
                justify-content: flex-start;
            }
        }
        
        .container_peer_id {
            display: flex;
            width: 100%;
        }
        
        .bootstrap-address {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
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
        
        <div class="card">
            <h3>📡 Bootstrap Address</h3>
            <div class="info-item">
                <span class="info-label">Primary Address:</span>
                <div class="bootstrap-address">
                    <span class="info-value" id="primaryAddress">${pathNode.filter(item => item.includes('/ws'))}</span>
                    <button class="copy-btn" data-id="primaryAddress">Copy</button>
                </div>
            </div>
            <div class="refresh-info">Use this address to connect other nodes to this relay</div>
        </div>
        
        <div class="dashboard">
            <!-- Остальные карточки остаются без изменений -->
            <div class="card">
                <h3>🆔 Node Identity</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Peer ID:</span>
                        <div class="container_peer_id">
                            <span class="info-value" id="peerId">${libp2p.peerId.publicKey.toString()}</span>
                            <button class="copy-btn" data-id="peerId">Copy</button>
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
                        <span class="info-value" id="nodePort">${PORT}</span>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>🌐 Network Addresses</h3>
                <div class="info-grid" id="addressesList">
                    ${libp2p.getMultiaddrs().map((addr, index) =>
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
                        <div class="stat-value" id="peersCount">${libp2p.getPeers().length}</div>
                        <div class="stat-label">Connected Peers</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="clientsCount">0</div>
                        <div class="stat-label">SSE Clients</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="dhtMode">${libp2p.services.lanDHT?.getMode() || 'Unknown'}</div>
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
                <button class="btn" onclick="window.refreshPeers()">🔄 Refresh Peers</button>
                <button class="btn btn-secondary" onclick="window.copyAllAddresses()">📋 Copy All Addresses</button>
                <button class="btn" onclick="window.exportNodeInfo()">💾 Export Node Info</button>
                <button class="btn btn-success" onclick="window.showPeerForm('getAllPeers')">📋 Get All Peers</button>
                <button class="btn btn-danger" onclick="window.showPeerForm('disconnectAll')">🚫 Disconnect All</button>
            </div>
            
            <!-- Формы для управления пирами -->
            <div class="peer-management">
                <!-- Форма для получения всех пиров -->
                <div id="getAllPeersForm" class="peer-form hidden">
                    <h4>📋 Get All Peers</h4>
                    <p>Get detailed information about all connected peers</p>
                    <div class="form-actions">
                        <button class="btn btn-success" onclick="window.getAllPeers()">Get All Peers</button>
                        <button class="btn btn-secondary" onclick="window.hidePeerForm('getAllPeers')">Cancel</button>
                    </div>
                    <div id="getAllPeersResponse" class="response-area hidden"></div>
                </div>
                
                <!-- Форма для получения информации о конкретном пире -->
                <div id="getPeerForm" class="peer-form hidden">
                    <h4>🔍 Get Peer Info</h4>
                    <div class="form-group">
                        <label class="form-label" for="peerIdInput">Peer ID:</label>
                        <input type="text" id="peerIdInput" class="form-input" placeholder="Enter Peer ID...">
                    </div>
                    <div class="form-actions">
                        <button class="btn btn-success" onclick="window.getPeerInfo()">Get Peer Info</button>
                        <button class="btn btn-secondary" onclick="window.hidePeerForm('getPeer')">Cancel</button>
                    </div>
                    <div id="getPeerResponse" class="response-area hidden"></div>
                </div>
                
                <!-- Форма для отключения конкретного пира -->
                <div id="disconnectPeerForm" class="peer-form hidden">
                    <h4>🚫 Disconnect Peer</h4>
                    <div class="form-group">
                        <label class="form-label" for="disconnectPeerIdInput">Peer ID:</label>
                        <input type="text" id="disconnectPeerIdInput" class="form-input" placeholder="Enter Peer ID to disconnect...">
                    </div>
                    <div class="form-actions">
                        <button class="btn btn-danger" onclick="window.disconnectPeer()">Disconnect Peer</button>
                        <button class="btn btn-secondary" onclick="window.hidePeerForm('disconnectPeer')">Cancel</button>
                    </div>
                    <div id="disconnectPeerResponse" class="response-area hidden"></div>
                </div>
                
                <!-- Форма для отключения всех пиров -->
                <div id="disconnectAllForm" class="peer-form hidden">
                    <h4>🚫 Disconnect All Peers</h4>
                    <p><strong>Warning:</strong> This will disconnect all connected peers. This action cannot be undone.</p>
                    <div class="form-actions">
                        <button class="btn btn-danger" onclick="window.disconnectAllPeers()">Confirm Disconnect All</button>
                        <button class="btn btn-secondary" onclick="window.hidePeerForm('disconnectAll')">Cancel</button>
                    </div>
                    <div id="disconnectAllResponse" class="response-area hidden"></div>
                </div>
            </div>
            
            <div class="peers-list" id="peersList">
                ${libp2p.getPeers().length > 0
        ? libp2p.getPeers().map(peer => {
            const peerIdString = peer.toString();
            return `
                    <div class="peer-item">
                        <div class="peer-info">${peerIdString}</div>
                        <div class="peer-actions">
                            <button class="peer-btn peer-btn-info" onclick="window.getSpecificPeerInfo('${peerIdString}')">
                                🔍 Get Info
                            </button>
                            <button class="peer-btn peer-btn-danger" onclick="window.disconnectSpecificPeer('${peerIdString}')">
                                🚫 Disconnect
                            </button>
                        </div>
                    </div>`;
        }).join('')
        : '<div class="refresh-info">No peers connected</div>'
    }
            </div>
        </div>
    </div>

    <script type="module">
        // Делаем функции глобальными, чтобы они были доступны из HTML
        window.nodeData = {};
        window.startTime = Date.now();
        
        // Функции для управления формами
        window.showPeerForm = function(formType) {
            // Скрываем все формы
            window.hideAllPeerForms();
            
            // Показываем нужную форму
            switch(formType) {
                case 'getAllPeers':
                    document.getElementById('getAllPeersForm').classList.remove('hidden');
                    break;
                case 'getPeer':
                    document.getElementById('getPeerForm').classList.remove('hidden');
                    break;
                case 'disconnectPeer':
                    document.getElementById('disconnectPeerForm').classList.remove('hidden');
                    break;
                case 'disconnectAll':
                    document.getElementById('disconnectAllForm').classList.remove('hidden');
                    break;
            }
        };
        
        window.hidePeerForm = function(formType) {
            const form = document.getElementById(formType + 'Form');
            if (form) {
                form.classList.add('hidden');
            }
            const response = document.getElementById(formType + 'Response');
            if (response) {
                response.classList.add('hidden');
            }
        };
        
        window.hideAllPeerForms = function() {
            const forms = [
                'getAllPeersForm',
                'getPeerForm', 
                'disconnectPeerForm',
                'disconnectAllForm'
            ];
            forms.forEach(formId => {
                const form = document.getElementById(formId);
                if (form) form.classList.add('hidden');
            });
        };
        
        // Функции для работы с конкретными пирами (кнопки рядом с пиром)
        window.getSpecificPeerInfo = function(peerId) {
            document.getElementById('peerIdInput').value = peerId;
            window.showPeerForm('getPeer');
            window.getPeerInfo();
        };
        
        window.disconnectSpecificPeer = function(peerId) {
            document.getElementById('disconnectPeerIdInput').value = peerId;
            window.showPeerForm('disconnectPeer');
            window.disconnectPeer();
        };
        
        // Функции для работы с API
        window.getAllPeers = async function() {
            try {
                const response = await fetch('/peers');
                const data = await response.json();
                
                const responseArea = document.getElementById('getAllPeersResponse');
                responseArea.textContent = JSON.stringify(data, null, 2);
                responseArea.classList.remove('hidden');
                responseArea.className = 'response-area response-success';
                
                window.showNotification('Peers information retrieved successfully');
            } catch (error) {
                const responseArea = document.getElementById('getAllPeersResponse');
                responseArea.textContent = 'Error: ' + error.message;
                responseArea.classList.remove('hidden');
                responseArea.className = 'response-area response-error';
                
                window.showNotification('Error getting peers information');
            }
        };
        
        window.getPeerInfo = async function() {
            const peerId = document.getElementById('peerIdInput').value.trim();
            if (!peerId) {
                alert('Please enter a Peer ID');
                return;
            }
            
            try {
                const response = await fetch(\`/peers/\${peerId}\`);
                const data = await response.json();
                
                const responseArea = document.getElementById('getPeerResponse');
                responseArea.textContent = JSON.stringify(data, null, 2);
                responseArea.classList.remove('hidden');
                responseArea.className = 'response-area response-success';
                
                window.showNotification(\`Peer \${peerId} information retrieved\`);
            } catch (error) {
                const responseArea = document.getElementById('getPeerResponse');
                responseArea.textContent = 'Error: ' + error.message;
                responseArea.classList.remove('hidden');
                responseArea.className = 'response-area response-error';
                
                window.showNotification('Error getting peer information');
            }
        };
        
        window.disconnectPeer = async function() {
            const peerId = document.getElementById('disconnectPeerIdInput').value.trim();
            if (!peerId) {
                alert('Please enter a Peer ID');
                return;
            }
            
            if (!confirm(\`Are you sure you want to disconnect peer \${peerId}?\`)) {
                return;
            }
            
            try {
                const response = await fetch(\`/peers/disconnect/\${peerId}\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                
                const responseArea = document.getElementById('disconnectPeerResponse');
                responseArea.textContent = JSON.stringify(data, null, 2);
                responseArea.classList.remove('hidden');
                responseArea.className = 'response-area response-success';
                
                window.showNotification(\`Peer \${peerId} disconnected successfully\`);
                
                // Обновляем список пиров
                setTimeout(window.refreshPeers, 1000);
            } catch (error) {
                const responseArea = document.getElementById('disconnectPeerResponse');
                responseArea.textContent = 'Error: ' + error.message;
                responseArea.classList.remove('hidden');
                responseArea.className = 'response-area response-error';
                
                window.showNotification('Error disconnecting peer');
            }
        };
        
        window.disconnectAllPeers = async function() {
            if (!confirm('Are you sure you want to disconnect ALL peers? This action cannot be undone.')) {
                return;
            }
            
            try {
                const response = await fetch('/peers/disconnect-all', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                
                const responseArea = document.getElementById('disconnectAllResponse');
                responseArea.textContent = JSON.stringify(data, null, 2);
                responseArea.classList.remove('hidden');
                responseArea.className = 'response-area response-success';
                
                window.showNotification('All peers disconnected successfully');
                
                // Обновляем список пиров
                setTimeout(window.refreshPeers, 1000);
            } catch (error) {
                const responseArea = document.getElementById('disconnectAllResponse');
                responseArea.textContent = 'Error: ' + error.message;
                responseArea.classList.remove('hidden');
                responseArea.className = 'response-area response-error';
                
                window.showNotification('Error disconnecting all peers');
            }
        };
        
        // Существующие функции (остаются без изменений)
        window.copyAllAddresses = function() {
            const addresses = Array.from(document.querySelectorAll('.address-item'))
                .map(item => item.textContent)
                .join('\\\\n');
            
            if (addresses) {
                navigator.clipboard.writeText(addresses).then(() => {
                    window.showNotification('All addresses copied to clipboard!');
                });
            }
        };
        
        window.exportNodeInfo = function() {
            const nodeInfo = {
                peerId: document.getElementById('peerId').textContent,
                addresses: Array.from(document.querySelectorAll('.address-item')).map(item => item.textContent),
                peers: Array.from(document.querySelectorAll('.peer-item .peer-info')).map(item => item.textContent),
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
            
            window.showNotification('Node information exported!');
        };
        
        window.showNotification = function(message) {
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
        };
        
        window.formatUptime = function() {
            const seconds = Math.floor((Date.now() - window.startTime) / 1000);
            const days = Math.floor(seconds / 86400);
            const hours = Math.floor((seconds % 86400) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            
            if (days > 0) return \`\${days}d \${hours}h \${minutes}m\`;
            if (hours > 0) return \`\${hours}h \${minutes}m \${secs}s\`;
            if (minutes > 0) return \`\${minutes}m \${secs}s\`;
            return \`\${secs}s\`;
        };
        
        window.refreshPeers = async function() {
            try {
                const response = await fetch('/peers');
                const data = await response.json();
                window.nodeData = data;
                window.updateDashboard();
                window.showNotification('Peers list updated');
            } catch (error) {
                console.log('Error fetching peers:', error);
                window.nodeData = {}
                window.updateDashboard();
                window.showNotification('Error updating peers list');
            }
        };
        
        window.refreshClients = async function() {
            try {
                const response = await fetch('/clients');
                const clients = await response.json();
                document.getElementById('clientsCount').textContent = clients.length;
            } catch (error) {
                document.getElementById('clientsCount').textContent = 'Сервер не найден';
                console.log('Error fetching clients:', error);
            }
        };
        
        window.updateDashboard = function() {
            if (window.nodeData.peers && Array.isArray(window.nodeData.peers)) {
                document.getElementById('peersCount').textContent = window.nodeData.peers.length;
                
                const peersList = document.getElementById('peersList');
                if (window.nodeData.peers.length > 0) {
                    // Обрабатываем данные из API - извлекаем peerId из объектов
                    const peerItems = window.nodeData.peers.map(peer => {
                        // Если peer - это объект, извлекаем peerId, иначе используем как строку
                        const peerId = typeof peer === 'object' && peer.peerId ? peer.peerId : peer;
                        const peerIdString = String(peerId);
                        
                        return \`<div class="peer-item">
                            <div class="peer-info">\${peerIdString}</div>
                            <div class="peer-actions">
                                <button class="peer-btn peer-btn-info" onclick="window.getSpecificPeerInfo('\${peerIdString.replace(/'/g, "\\\\'")}')">
                                    🔍 Get Info
                                </button>
                                <button class="peer-btn peer-btn-danger" onclick="window.disconnectSpecificPeer('\${peerIdString.replace(/'/g, "\\\\'")}')">
                                    🚫 Disconnect
                                </button>
                            </div>
                        </div>\`;
                    }).join('');
                    
                    peersList.innerHTML = peerItems;
                } else {
                    peersList.innerHTML = '<div class="refresh-info">No peers connected</div>';
                }
            } else {
                document.getElementById('peersCount').textContent = '0';
                const peersList = document.getElementById('peersList');
                peersList.innerHTML = '<div class="refresh-info">No peers connected</div>';
            }
            
            if (window.nodeData.dhtMode) {
                document.getElementById('dhtMode').textContent = window.nodeData.dhtMode;
            }
        };
        
        function getPageIdentifier() {
            let pageId = sessionStorage.getItem('pageIdentifier');
            if (!pageId) {
                pageId = crypto.randomUUID();
                sessionStorage.setItem('pageIdentifier', pageId);
                console.log('New page session ID:', pageId);
            }
            return "/events?pageId=" + pageId;
        }

        function setupEventSource() {
            const url = getPageIdentifier();
            const events = new EventSource(url);
            
            events.onmessage = (event) => {
                const data = JSON.parse(event.data); 
                if (data.peerId && data.peerId !== document.getElementById('peerId').textContent) {
                    document.getElementById('peerId').textContent = data.peerId;
                }
            };
            
            events.onerror = (err) => {
                console.log('SSE connection error:', err);
                document.getElementById('nodeStatus').textContent = 'Connection Issues';
                document.querySelector('#nodeStatus').previousElementSibling.class = 'status-indicator status-offline';
            };
        }
        
        document.addEventListener('DOMContentLoaded', function() {
            setupEventSource();
            window.refreshClients();
            window.refreshPeers();
            
            // Utility functions
            function copyToClipboard(event) {
                const button = event.currentTarget
                const element = document.getElementById(button.dataset.id);
                const text = element.textContent || element.innerText;
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = button.textContent;
                    button.textContent = '✓ Copied!';
                    button.classList.add('copied');
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                    alert('Failed to copy to clipboard');
                });
            }
        
            const copyButtons = document.body.querySelectorAll('.copy-btn')
            copyButtons.forEach(item => {
                item.addEventListener('click', copyToClipboard)
            })
        
            document.getElementById('libp2pVersion').textContent = '3.0.6';
            
            setInterval(() => {
                document.getElementById('uptime').textContent = window.formatUptime();
            }, 1000);
            
            setInterval(() => {
                window.refreshPeers();
                window.refreshClients();
            }, 3000);
        });
    </script>
</body>
</html>`;
}
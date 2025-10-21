// Импортируем необходимые модули
import { createLibp2p } from 'libp2p';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { webSockets } from '@libp2p/websockets';
import { webRTC } from '@libp2p/webrtc';
import { identify } from '@libp2p/identify';
import { gossipsub } from 'https://cdn.jsdelivr.net/npm/@libp2p/gossipsub@15.0.7/+esm'
import { multiaddr } from '@multiformats/multiaddr';
import { fromString } from 'uint8arrays';
import {WebRTC, WebSockets} from "@multiformats/multiaddr-matcher";

/**
 * Фабричная функция для создания действий компонента PeerConnection
 * @param {Object} context - Контекст компонента
 * @returns {Promise<Object>} Объект с методами действий
 */
export async function createActions(context) {
    let libp2p = null;
    let connectionInterval = null;

    const self = {
        /**
         * Инициализирует Libp2p узел
         * @async
         * @param {string} mode - Режим работы ('listener' | 'dialer')
         * @returns {Promise<Object>} Экземпляр Libp2p
         */
        async initializeLibp2p(mode = 'listener') {
            try {
                const serverPeerId = '12D3KooWBHSGgQQNinaUn9mtx7iqfQSM3sb1Fr1aCnkqLnyeT88i';
                const PORT = 6835;
                const RENDER_EXTERNAL_HOSTNAME = window.location.hostname;
                const isLocalhost = window.location.hostname === 'localhost';

                // Конфигурация Libp2p
                const config = {
                    addresses: {
                        listen: [
                            '/p2p-circuit',
                            '/webrtc'
                        ]
                    },
                    transports: [
                        webSockets(),
                        webRTC(),
                        circuitRelayTransport()
                    ],
                    connectionEncrypters: [noise()],
                    streamMuxers: [yamux()],
                    services: {
                        identify: identify(),
                        pubsub: gossipsub({
                            doPX: true,
                            emitSelf: true
                        })
                    },
                    connectionGater: {
                        denyDialMultiaddr: () => false,
                        denyDialPeer: () => false,
                        denyOutboundConnection: () => false,
                        denyOutboundEncryptedConnection: () => false,
                        denyOutboundUpgradedConnection: () => false,
                        denyInboundConnection: () => false,
                        denyInboundEncryptedConnection: () => false,
                        denyInboundUpgradedConnection: () => false,
                        filterMultiaddrForPeer: async () => true
                    }
                };

                libp2p = await createLibp2p(config);
                await libp2p.start();

                console.log('Libp2p узел инициализирован:', {
                    peerId: libp2p.peerId.toString(),
                    mode: mode,
                    addresses: libp2p.getMultiaddrs().map(ma => ma.toString())
                });

                // Настройка обработчиков событий
                await self.setupEventHandlers();

                // Запускаем обновление списка подключенных пиров
                await self.startPeerListUpdates();

                return libp2p;

            } catch (error) {
                console.error('Ошибка инициализации Libp2p:', error);
                context.addError({
                    componentName: context.constructor.name,
                    source: 'initializeLibp2p',
                    message: 'Не удалось инициализировать P2P узел',
                    details: error
                });
                throw error;
            }
        },

        /**
         * Настраивает обработчики событий Libp2p
         * @async
         */
        async setupEventHandlers() {
            if (!libp2p) return;

            // Обработчик подключения пира
            libp2p.addEventListener('peer:connect', (event) => {
                console.log('✅ Подключен пир:', event.detail.toString());

                // Обновляем список пиров
                setTimeout(async () => {
                    await self.updatePeerList();
                    await self.sendPeersToChatInterface();
                }, 500);
            });

            // Обработчик отключения пира
            libp2p.addEventListener('peer:disconnect', (event) => {
                console.log('❌ Отключен пир:', event.detail.toString());

                // Обновляем список пиров
                setTimeout(async () => {
                    await self.updatePeerList();
                    await self.sendPeersToChatInterface();
                }, 500);
            });

            // Обновление собственных адреса
            libp2p.addEventListener('self:peer:update', (event) => {
                console.log('🔄 Обновлены адреса узла');
                self.updateAddressList();
                self.sendConnectionStatusToChatInterface();
            });

            // Обнаружение пиров
            libp2p.addEventListener('peer:discovery', (event) => {
                console.log('🔍 Обнаружен пир:', event.detail.id.toString());
                // Также обновляем список при обнаружении новых пиров
                setTimeout(async () => {
                    await self.updatePeerList();
                    await self.sendPeersToChatInterface();
                }, 1000);
            });
        },

        /**
         * Передает данные о пирах в chat-interface
         */
        async sendPeersToChatInterface() {
            try {
                const chatInterface = await context.getComponentAsync('chat-interface', 'main-chat');
                if (chatInterface) {
                    // Формируем данные для передачи
                    const peersData = {
                        totalPeers: context.state.connectedPeers ? context.state.connectedPeers.length : 0,
                        peers: context.state.connectedPeers ? context.state.connectedPeers.map(peer => ({
                            id: peer.id,
                            connections: peer.connections ? peer.connections.length : 1,
                            status: 'connected'
                        })) : [],
                        connectionStatus: context.state.connected,
                        timestamp: Date.now()
                    };

                    // Отправляем сообщение в chat-interface
                    await chatInterface.postMessage({
                        type: 'PEERS_UPDATE',
                        data: peersData
                    });

                    console.log('✅ Peers data sent to chat-interface:', peersData);
                } else {
                    console.log('⏳ Chat interface not found, will retry...');
                    // Повторяем попытку через 1 секунду
                    setTimeout(() => self.sendPeersToChatInterface(), 1000);
                }
            } catch (error) {
                console.error('❌ Error sending peers to chat interface:', error);
            }
        },

        /**
         * Передает информацию о соединении в chat-interface
         */
        async sendConnectionStatusToChatInterface() {
            try {
                const chatInterface = await context.getComponentAsync('chat-interface', 'main-chat');
                if (chatInterface) {
                    const connectionData = {
                        connected: context.state.connected,
                        peerId: context.state.peerId,
                        mode: context.state.mode,
                        uptime: context.state.uptime,
                        timestamp: Date.now()
                    };

                    await chatInterface.postMessage({
                        type: 'CONNECTION_STATUS_UPDATE',
                        data: connectionData
                    });

                    console.log('✅ Connection status sent to chat-interface:', connectionData);
                }
            } catch (error) {
                console.error('❌ Error sending connection status:', error);
            }
        },

        /**
         * Обновляет секцию со статистикой
         */
        async updateStatsCard() {
            const statsCard = context.shadowRoot.querySelector('.stats-card');
            if (statsCard && context.renderPart) {
                console.log('🔄 Updating stats card section');
                await context.renderPart({
                    partName: 'renderStatistics',
                    state: context.state,
                    selector: '.stats-card .card-content'
                });
            } else {
                console.log('⚠️ Stats card not found, using full render');
                await context.fullRender(context.state);
            }
        },

        /**
         * Запускает периодическое обновление списка пиров
         * @async
         */
        async startPeerListUpdates() {
            if (connectionInterval) {
                clearInterval(connectionInterval);
            }

            connectionInterval = setInterval(() => {
                console.log('🔄 Автоматическое обновление...');
                self.updatePeerList();
                self.updateAddressList();
                self.updateStatsCard();
                self.sendPeersToChatInterface();
                self.sendConnectionStatusToChatInterface();
            }, 5000);

            // Однократное обновление после полной загрузки
            setTimeout(() => {
                console.log('🔄 Однократное обновление после загрузки');
                self.manualUpdate();
            }, 4000);
        },

        /**
         * Ручное обновление списков
         * @async
         */
        async manualUpdate() {
            console.log('🔄 Ручное обновление списков...');

            const addressesElement = context.shadowRoot.querySelector('#listening-addresses');
            const peersElement = context.shadowRoot.querySelector('#connected-peers-list');

            console.log('🔍 Состояние DOM:', {
                addressesElement: !!addressesElement,
                peersElement: !!peersElement,
                shadowRoot: !!context.shadowRoot
            });

            if (context.shadowRoot) {
                console.log('🔍 Все элементы в shadowRoot:');
                context.shadowRoot.querySelectorAll('*').forEach(el => {
                    if (el.id) {
                        console.log('  -', el.tagName, `#${el.id}`);
                    }
                });
            }

            await self.updatePeerList();
            await self.updateAddressList();
            await self.sendPeersToChatInterface();
            await self.sendConnectionStatusToChatInterface();
        },

        /**
         * Принудительное обновление всех списков (для отладки)
         * @async
         */
        async forceUpdate() {
            console.log('💥 Принудительное обновление всех списков');

            if (libp2p) {
                console.log('📊 Текущее состояние libp2p:', {
                    peerId: libp2p.peerId?.toString(),
                    addresses: libp2p.getMultiaddrs().map(ma => ma.toString()),
                    peers: libp2p.getPeers().map(p => p.toString())
                });
            }

            await self.manualUpdate();
        },

        /**
         * Обновляет список подключенных пиров
         * @async
         */
        async updatePeerList() {
            if (!libp2p || !context.state) {
                console.log('❌ updatePeerList: libp2p или context.state не доступны');
                return;
            }

            const peers = await self.getConnectedPeers();
            context.state.connectedPeers = peers;

            console.log('👥 updatePeerList: пиров найдено:', peers.length);

            const peersElement = context.shadowRoot.querySelector('#connected-peers-list');
            console.log('🔍 updatePeerList: элемент #connected-peers-list найден:', !!peersElement);

            if (peersElement && context.renderPart) {
                console.log('🎯 updatePeerList: выполняем renderPart');
                await context.renderPart({
                    partName: 'renderPeersList',
                    state: context.state,
                    selector: '#connected-peers-list'
                });
                console.log('✅ updatePeerList: renderPart завершен');
            } else {
                console.log('⚠️ updatePeerList: renderPart не выполнен - элемент не найден');
            }
        },

        /**
         * Обновляет список адресов прослушивания
         * @async
         */
        async updateAddressList() {
            if (!libp2p || !context.state) {
                console.log('❌ updateAddressList: libp2p или context.state не доступны');
                return;
            }

            const addresses = libp2p.getMultiaddrs().filter(ma => WebRTC.matches(ma)).map(ma => ma.toString());
            context.state.listeningAddresses = addresses;

            console.log('📋 updateAddressList: адресов найдено:', addresses.length);

            const addressesElement = context.shadowRoot.querySelector('#listening-addresses');
            console.log('🔍 updateAddressList: элемент #listening-addresses найден:', !!addressesElement);

            if (addressesElement && context.renderPart) {
                console.log('🎯 updateAddressList: выполняем renderPart');
                await context.renderPart({
                    partName: 'renderAddressesList',
                    state: context.state,
                    selector: '#listening-addresses'
                });
                console.log('✅ updateAddressList: renderPart завершен');
            } else {
                console.log('⚠️ updateAddressList: renderPart не выполнен - элемент не найден');
            }
        },

        /**
         * Подключается к указанному пиру
         * @async
         * @param {string} multiaddrStr - Multiaddr для подключения
         */
        async connectToPeer(multiaddrStr) {
            try {
                if (!libp2p) {
                    throw new Error('Libp2p не инициализирован');
                }

                const ma = multiaddr(multiaddrStr.trim());

                console.log('Подключаемся к:', ma.toString());
                await libp2p.dial(ma);

                console.log('Успешно подключены к:', ma.toString());

            } catch (error) {
                console.error('Ошибка подключения к пиру:', error);
                context.addError({
                    componentName: context.constructor.name,
                    source: 'connectToPeer',
                    message: `Не удалось подключиться к ${multiaddrStr}`,
                    details: error
                });
                throw error;
            }
        },

        /**
         * Получает список подключенных пиров
         * @async
         * @returns {Array<string>} Массив идентификаторов пиров
         */
        async getConnectedPeers() {
            if (!libp2p) return [];

            return libp2p.getPeers().map(peerId => {
                const connections = libp2p.getConnections(peerId);
                return {
                    id: peerId.toString(),
                    connections: connections.map(conn => ({
                        id: conn.id,
                        remoteAddr: conn.remoteAddr.toString(),
                        status: conn.status
                    }))
                };
            });
        },

        /**
         * Получает relay адреса текущего узла
         * @async
         * @returns {Array<string>} Массив relay адресов
         */
        async getRelayAddresses() {
            if (!libp2p) return [];

            return libp2p.getMultiaddrs()
                .map(ma => ma.toString())
                .filter(addr => addr.includes('/p2p-circuit') || addr.includes('/webrtc'));
        },

        /**
         * Подписывается на PubSub топик
         * @async
         * @param {string} topic - Название топика
         */
        async subscribeToTopic(topic) {
            try {
                if (!libp2p) {
                    throw new Error('Libp2p не инициализирован');
                }

                await libp2p.services.pubsub.subscribe(topic);
                console.log(`Подписались на топик: ${topic}`);

            } catch (error) {
                console.error('Ошибка подписки на топик:', error);
                throw error;
            }
        },

        /**
         * Отправляет сообщение в PubSub топик
         * @async
         * @param {string} topic - Название топика
         * @param {string} message - Сообщение для отправки
         */
        async sendTopicMessage(topic, message) {
            try {
                if (!libp2p) {
                    throw new Error('Libp2p не инициализирован');
                }


                await libp2p.services.pubsub.publish(topic, fromString(message));
                console.log(`Отправлено сообщение в топик ${topic}: ${message}`);

            } catch (error) {
                console.error('Ошибка отправки сообщения:', error);
                throw error;
            }
        },

        /**
         * Получает список пиров в топике
         * @async
         * @param {string} topic - Название топика
         * @returns {Array<string>} Массив идентификаторов пиров
         */
        async getTopicPeers(topic) {
            if (!libp2p) return [];

            try {
                return libp2p.services.pubsub.getSubscribers(topic)
                    .map(peerId => peerId.toString());
            } catch (error) {
                console.error('Ошибка получения списка пиров топика:', error);
                return [];
            }
        },

        /**
         * Останавливает Libp2p узел и очищает ресурсы
         * @async
         */
        async cleanup() {
            try {
                if (connectionInterval) {
                    clearInterval(connectionInterval);
                    connectionInterval = null;
                }

                if (libp2p) {
                    await libp2p.stop();
                    libp2p = null;
                    console.log('Libp2p узел остановлен');
                }
            } catch (error) {
                console.error('Ошибка очистки ресурсов:', error);
            }
        },

        /**
         * Перезапускает узел с новыми настройками
         * @async
         * @param {string} mode - Новый режим работы
         */
        async restart(mode) {
            await self.cleanup();
            return await self.initializeLibp2p(mode);
        },

        /**
         * Проверяет статус подключения
         * @returns {boolean} true если узел активен
         */
        isConnected() {
            return libp2p !== null;
        },

        /**
         * Получает статистику подключений
         * @returns {Object} Объект со статистикой
         */
        getConnectionStats() {
            if (!libp2p) {
                return {
                    connected: false,
                    peerCount: 0,
                    connectionCount: 0
                };
            }

            const peers = libp2p.getPeers();
            let connectionCount = 0;

            peers.forEach(peerId => {
                connectionCount += libp2p.getConnections(peerId).length;
            });

            return {
                connected: true,
                peerCount: peers.length,
                connectionCount: connectionCount,
                peerId: libp2p.peerId.toString(),
                addresses: libp2p.getMultiaddrs().map(ma => ma.toString())
            };
        }
    };

    return {
        initializeLibp2p: self.initializeLibp2p.bind(self),
        setupEventHandlers: self.setupEventHandlers.bind(self),
        startPeerListUpdates: self.startPeerListUpdates.bind(self),
        manualUpdate: self.manualUpdate.bind(self),
        forceUpdate: self.forceUpdate.bind(self),
        updatePeerList: self.updatePeerList.bind(self),
        updateAddressList: self.updateAddressList.bind(self),
        connectToPeer: self.connectToPeer.bind(self),
        getConnectedPeers: self.getConnectedPeers.bind(self),
        getRelayAddresses: self.getRelayAddresses.bind(self),
        subscribeToTopic: self.subscribeToTopic.bind(self),
        sendTopicMessage: self.sendTopicMessage.bind(self),
        getTopicPeers: self.getTopicPeers.bind(self),
        cleanup: self.cleanup.bind(self),
        restart: self.restart.bind(self),
        isConnected: self.isConnected.bind(self),
        getConnectionStats: self.getConnectionStats.bind(self),
        sendPeersToChatInterface: self.sendPeersToChatInterface.bind(self),
        sendConnectionStatusToChatInterface: self.sendConnectionStatusToChatInterface.bind(self)
    };
}
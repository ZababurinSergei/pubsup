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
// Импортируем логгер
import { logger } from '@libp2p/logger';

/**
 * Фабричная функция для создания действий компонента PeerConnection
 * @param {Object} context - Контекст компонента
 * @returns {Promise<Object>} Объект с методами действий
 */
export async function createActions(context) {
    // Создаем именованный логгер для компонента
    const log = logger('peer-connection:actions');

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

                log('Libp2p узел инициализирован: %o', {
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
                log.error('Ошибка инициализации Libp2p: %o', error);
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
            libp2p.addEventListener('peer:connect', async (event) => {
                log('Подключен пир: %s', event.detail.toString());

                // Обновляем список пиров
                // setTimeout(async () => {
                    await self.updatePeerList();
                    await self.sendPeersToChatInterface();
                // }, 500);
            });

            // Обработчик отключения пира
            libp2p.addEventListener('peer:disconnect', async (event) => {
                log('Отключен пир: %s', event.detail.toString());

                // Обновляем список пиров
                // setTimeout(async () => {
                    await self.updatePeerList();
                    await self.sendPeersToChatInterface();
                // }, 500);
            });

            // Обновление собственных адреса
            libp2p.addEventListener('self:peer:update', (event) => {
                log('Обновлены адреса узла');
                self.updatePeerList();
                self.updateAddressList();
                self.updateStatsCard();
                self.sendPeersToChatInterface();
                self.sendConnectionStatusToChatInterface();
            });

            // Обнаружение пиров
            libp2p.addEventListener('peer:discovery', async (event) => {
                log('Обнаружен пир: %s', event.detail.id.toString());
                // Также обновляем список при обнаружении новых пиров
                // setTimeout(async () => {
                    await self.updatePeerList();
                    await self.sendPeersToChatInterface();
                // }, 1000);
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

                    log.trace('Peers data sent to chat-interface: %o', peersData);
                } else {
                    log('Chat interface not found, will retry...');
                    // Повторяем попытку через 1 секунду
                    setTimeout(() => self.sendPeersToChatInterface(), 1000);
                }
            } catch (error) {
                log.error('Error sending peers to chat interface: %o', error);
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

                    log.trace('Connection status sent to chat-interface: %o', connectionData);
                }
            } catch (error) {
                log.error('Error sending connection status: %o', error);
            }
        },

        /**
         * Обновляет секцию со статистикой
         */
        async updateStatsCard() {
            const statsCard = context.shadowRoot.querySelector('.stats-card');
            if (statsCard && context.renderPart) {
                log.trace('Updating stats card section');
                await context.renderPart({
                    partName: 'renderStatistics',
                    state: context.state,
                    selector: '.stats-card .card-content'
                });
            } else {
                log('Stats card not found, using full render');
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

            // connectionInterval = setInterval(() => {
            //     log.trace('Автоматическое обновление...');
                self.updatePeerList();
                self.updateAddressList();
                self.updateStatsCard();
                self.sendPeersToChatInterface();
                self.sendConnectionStatusToChatInterface();
            // }, 5000);

            // Однократное обновление после полной загрузки
            setTimeout(() => {
                log.trace('Однократное обновление после загрузки');
                self.manualUpdate();
            }, 4000);
        },

        /**
         * Ручное обновление списков
         * @async
         */
        async manualUpdate() {
            log.trace('Ручное обновление списков...');

            const addressesElement = context.shadowRoot.querySelector('#listening-addresses');
            const peersElement = context.shadowRoot.querySelector('#connected-peers-list');

            log.trace('Состояние DOM: %o', {
                addressesElement: !!addressesElement,
                peersElement: !!peersElement,
                shadowRoot: !!context.shadowRoot
            });

            if (context.shadowRoot) {
                log.trace('Все элементы в shadowRoot:');
                context.shadowRoot.querySelectorAll('*').forEach(el => {
                    if (el.id) {
                        log.trace('  - %s #%s', el.tagName, el.id);
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
            log('Принудительное обновление всех списков');

            if (libp2p) {
                log('Текущее состояние libp2p: %o', {
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
                log('libp2p или context.state не доступны');
                return;
            }

            const peers = await self.getConnectedPeers();
            context.state.connectedPeers = peers;

            log('updatePeerList: пиров найдено: %d', peers.length);

            const peersElement = context.shadowRoot.querySelector('#connected-peers-list');
            log.trace('updatePeerList: элемент #connected-peers-list найден: %s', !!peersElement);

            if (peersElement && context.renderPart) {
                log.trace('updatePeerList: выполняем renderPart');
                await context.renderPart({
                    partName: 'renderPeersList',
                    state: context.state,
                    selector: '#connected-peers-list'
                });
                log.trace('updatePeerList: renderPart завершен');
            } else {
                log('updatePeerList: renderPart не выполнен - элемент не найден');
            }
        },

        /**
         * Обновляет список адресов прослушивания
         * @async
         */
        async updateAddressList() {
            console.log('!!!!!!!!!!!! updateAddressList !!!!!!!!!!!!!!!!')
            if (!libp2p || !context.state) {
                log.error('updateAddressList: libp2p или context.state не доступны');
                return;
            }

            const addresses = libp2p.getMultiaddrs().filter(ma => WebRTC.matches(ma)).map(ma => ma.toString());
            context.state.listeningAddresses = addresses;

            log.trace('updateAddressList: адресов найдено: %d', addresses.length);

            const addressesElement = context.shadowRoot.querySelector('#listening-addresses');
            log.trace('updateAddressList: элемент #listening-addresses найден: %s', !!addressesElement);

            if (addressesElement && context.renderPart) {
                log.trace('updateAddressList: выполняем renderPart');
                await context.renderPart({
                    partName: 'renderAddressesList',
                    state: context.state,
                    selector: '#listening-addresses'
                });
                log.trace('updateAddressList: renderPart завершен');
            } else {
                log('updateAddressList: renderPart не выполнен - элемент не найден');
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

                log('Подключаемся к: %s', ma.toString());
                await libp2p.dial(ma);

                log('Успешно подключены к: %s', ma.toString());

            } catch (error) {
                log.error('Ошибка подключения к пиру: %o', error);
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
                log('Подписались на топик: %s', topic);

            } catch (error) {
                log.error('Ошибка подписки на топик: %o', error);
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
                log('Отправлено сообщение в топик %s: %s', topic, message);

            } catch (error) {
                log.error('Ошибка отправки сообщения: %o', error);
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
                log.error('Ошибка получения списка пиров топика: %o', error);
                return [];
            }
        },



        /**
         * Уведомляет все компоненты о готовности новой ноды
         * @async
         */
        async notifyComponentsNodeReady() {
            const log = logger('peer-connection:actions:notifyNodeReady');

            try {
                // Уведомляем ChatManager
                const chatManager = await context.getComponentAsync('chat-manager', 'chat-manager');
                if (chatManager) {
                    await chatManager.postMessage({
                        type: 'NODE_RESTARTED',
                        data: {
                            peerId: context.state.peerId,
                            mode: context.state.mode,
                            timestamp: Date.now()
                        }
                    });
                }

                // Уведомляем GroupManager
                const groupManager = await context.getComponentAsync('group-manager', 'group-manager');
                if (groupManager) {
                    // GroupManager сам обнаружит новую ноду через свой механизм проверки
                    log('GroupManager уведомлен о перезапуске ноды');
                }

                log('Все компоненты уведомлены о готовности новой ноды');
            } catch (error) {
                log.error('Ошибка уведомления компонентов: %o', error);
            }
        },

        /**
         * Останавливает Libp2p узел и очищает ресурсы
         * @async
         */
        async cleanup() {
            const log = logger('peer-connection:actions:cleanup');

            try {
                log('Начало очистки P2P системы...');

                // 1. Останавливаем интервалы обновления
                if (connectionInterval) {
                    clearInterval(connectionInterval);
                    connectionInterval = null;
                    log('Остановлен интервал обновления пиров');
                }

                // 2. Уведомляем ChatManager о остановке
                try {
                    const chatManager = await context.getComponentAsync('chat-manager', 'chat-manager');
                    if (chatManager && chatManager._actions) {
                        log('Уведомляем ChatManager об остановке...');
                        await chatManager.postMessage({
                            type: 'NODE_SHUTDOWN',
                            data: {
                                peerId: libp2p?.peerId?.toString(),
                                timestamp: Date.now()
                            }
                        });
                    }
                } catch (error) {
                    log.error('Ошибка уведомления ChatManager: %o', error);
                }

                // 3. Уведомляем GroupManager о остановке
                try {
                    const groupManager = await context.getComponentAsync('group-manager', 'group-manager');
                    if (groupManager) {
                        log('Уведомляем GroupManager об остановке...');
                        // Сбрасываем состояние групп
                        groupManager.state.nodeReady = false;
                        groupManager.state.groups = [];
                        groupManager.state.discoveredGroups = [];
                        groupManager.state.joinedGroups = [];

                        // Обновляем UI
                        if (groupManager.fullRender) {
                            await groupManager.fullRender(groupManager.state);
                        }
                    }
                } catch (error) {
                    log.error('Ошибка уведомления GroupManager: %o', error);
                }

                // 4. Останавливаем Libp2p узел
                if (libp2p) {
                    log('Останавливаем Libp2p узел...');
                    await libp2p.stop();
                    libp2p = null;
                    log('Libp2p узел остановлен');
                }

                // 5. Очищаем состояние компонента
                context.state.connected = false;
                context.state.peerId = null;
                context.state.listeningAddresses = [];
                context.state.connectedPeers = [];
                context.state.uptime = '0:00';
                context.state.startTime = null;

                log('Очистка P2P системы завершена');

            } catch (error) {
                log.error('Критическая ошибка при очистке: %o', error);
                context.addError({
                    componentName: context.constructor.name,
                    source: 'cleanup',
                    message: 'Ошибка очистки P2P системы',
                    details: error
                });
                // Продолжаем выполнение даже при ошибках
            }
        },

        /**
         * Перезапускает узел с новыми настройками
         * @async
         * @param {string} mode - Новый режим работы
         */
        async restart(mode) {
            const log = logger('peer-connection:actions:restart');

            try {
                log('Начало перезапуска P2P системы в режиме: %s', mode);

                // 1. Полная очистка текущего состояния
                await this.cleanup();

                // 2. Краткая пауза для завершения операций
                await new Promise(resolve => setTimeout(resolve, 1000));

                // 3. Перезапуск ChatManager
                try {
                    const chatManager = await context.getComponentAsync('chat-manager', 'chat-manager');
                    if (chatManager) {
                        log('Перезапускаем ChatManager...');

                        // Сбрасываем состояние чата
                        chatManager.state.messages = [];
                        chatManager.state.currentGroup = null;
                        chatManager.state.connected = false;

                        // Переинициализируем из новой ноды
                        await chatManager.initializeFromPeerConnection();

                        log('ChatManager перезапущен');
                    }
                } catch (error) {
                    log.error('Ошибка перезапуска ChatManager: %o', error);
                }

                // 4. Перезапуск GroupManager
                try {
                    const groupManager = await context.getComponentAsync('group-manager', 'group-manager');
                    if (groupManager) {
                        log('Перезапускаем GroupManager...');

                        // Сбрасываем состояние групп
                        groupManager.state.groups = [];
                        groupManager.state.discoveredGroups = [];
                        groupManager.state.joinedGroups = [];
                        groupManager.state.nodeReady = false;

                        // Запускаем инициализацию заново
                        await groupManager.startNodeInitialization();

                        log('GroupManager перезапущен');
                    }
                } catch (error) {
                    log.error('Ошибка перезапуска GroupManager: %o', error);
                }

                // 5. Инициализация новой ноды
                log('Инициализируем новую Libp2p ноду...');
                const newLibp2p = await this.initializeLibp2p(mode);

                // 6. Уведомляем компоненты о готовности новой ноды
                await this.notifyComponentsNodeReady();

                log('Перезапуск P2P системы завершен успешно');
                return newLibp2p;

            } catch (error) {
                log.error('Ошибка перезапуска P2P системы: %o', error);
                throw error;
            }
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
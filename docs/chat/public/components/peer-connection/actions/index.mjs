// Импортируем необходимые модули
import { createLibp2p } from 'libp2p';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { webSockets } from '@libp2p/websockets';
import { webRTC } from '@libp2p/webrtc';
import { identify } from '@libp2p/identify';
import { floodsub } from '@libp2p/floodsub';
import { multiaddr } from '@multiformats/multiaddr';
import { fromString } from 'uint8arrays';
/**
 * Фабричная функция для создания действий компонента PeerConnection
 * @param {Object} context - Контекст компонента
 * @returns {Promise<Object>} Объект с методами действий
 */
export async function createActions(context) {
    let libp2p = null;
    let connectionInterval = null;

    return {
        /**
         * Инициализирует Libp2p узел
         * @async
         * @param {string} mode - Режим работы ('listener' | 'dialer')
         * @returns {Promise<Object>} Экземпляр Libp2p
         */
        async initializeLibp2p(mode = 'listener') {
            try {
                const serverPeerId = '12D3KooWBHSGgQQNinaUn9mtx7iqfQSM3sb1Fr1aCnkqLnyeT88i';
                const port = 6832;
                const RENDER_EXTERNAL_HOSTNAME = 'relay-tuem.onrender.com';
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
                        pubsub: floodsub()
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

                // Добавляем relay сервер для подключения
                if (mode === 'dialer') {
                    const relayMultiaddr = isLocalhost
                        ? `/dns4/localhost/tcp/${port}/ws/p2p/${serverPeerId}`
                        : `/dns4/${RENDER_EXTERNAL_HOSTNAME}/wss/p2p/${serverPeerId}`;

                    config.addresses.listen.push(relayMultiaddr);
                }

                libp2p = await createLibp2p(config);
                await libp2p.start();

                console.log('Libp2p узел инициализирован:', {
                    peerId: libp2p.peerId.toString(),
                    mode: mode,
                    addresses: libp2p.getMultiaddrs().map(ma => ma.toString())
                });

                // Настройка обработчиков событий
                this.setupEventHandlers();

                // Запускаем обновление списка подключенных пиров
                this.startPeerListUpdates();

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

            // Обновление списка пиров при подключении
            libp2p.addEventListener('peer:connect', (event) => {
                console.log('Подключен пир:', event.detail.toString());
                this.updatePeerList();
            });

            // Обновление списка пиров при отключении
            libp2p.addEventListener('peer:disconnect', (event) => {
                console.log('Отключен пир:', event.detail.toString());
                this.updatePeerList();
            });

            // Обновление собственных адресов
            libp2p.addEventListener('self:peer:update', (event) => {
                console.log('Обновлены адреса узла');
                this.updateAddressList();
            });

            // Обнаружение пиров
            libp2p.addEventListener('peer:discovery', (event) => {
                console.log('Обнаружен пир:', event.detail.id.toString());
            });
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
                this.updatePeerList();
                this.updateAddressList();
            }, 2000);
        },

        /**
         * Обновляет список подключенных пиров
         * @async
         */
        async updatePeerList() {
            if (libp2p && context.updatePeerList) {
                await context.updatePeerList();
            }
        },

        /**
         * Обновляет список адресов прослушивания
         * @async
         */
        async updateAddressList() {
            if (libp2p && context.state) {
                context.state.listeningAddresses = libp2p.getMultiaddrs().map(ma => ma.toString());
                await context.renderPart({
                    partName: 'renderAddresses',
                    state: context.state,
                    selector: '#listening-addresses'
                });
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

                const ma = multiaddr(multiaddrStr);

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
            await this.cleanup();
            return await this.initializeLibp2p(mode);
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
}
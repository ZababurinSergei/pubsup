import {BaseComponent} from '../../base/base-component.mjs';
import * as template from './template/index.mjs';
import {controller} from './controller/index.mjs';
import {createActions} from './actions/index.mjs';
import {lpStream} from '@libp2p/utils';
import {toString as uint8ArrayToString} from 'uint8arrays/to-string';
import {fromString as uint8ArrayFromString} from 'uint8arrays/from-string';
import {logger} from '@libp2p/logger';
import {multiaddr} from "@multiformats/multiaddr";
import {WebRTC, WebSockets} from "@multiformats/multiaddr-matcher"
import {generatePeerName} from "../utils/index.mjs";
const GROUPS_ANNOUNCEMENT_TOPIC = 'chat-groups-announcements';

// Создаем логгер для компонента
const log = logger('chat-manager');
export class ChatManager extends BaseComponent {
    constructor() {
        super();
        this._templateMethods = template;
        this.state = {
            mode: globalThis.APP_INITIAL_MODE,
            connected: false,
            messages: [],
            currentGroup: null,
            groups: [],
            discoveredGroups: [], // ← добавлено
            joinedGroups: [],     // ← добавлено
            searchQuery: '',
            peerId: null,
            listeningAddresses: [],
            connectedPeers: []
        };
        this.node = null;
        this.activeStreams = new Map(); // Для хранения активных стримов
    }

    async _componentReady() {
        log('ChatManager component ready');

        this._controller = await controller(this);
        this._actions = await createActions(this);
        await this._controller.init();

        // Получаем ноду из peer-connection вместо создания своей
        await this.initializeFromPeerConnection();

        return true;
    }

    async initializeFromPeerConnection() {
        try {
            // Получаем компонент peer-connection
            const peerConnection = await this.getComponentAsync('peer-connection', 'peer-connection');

            if (!peerConnection) {
                log.error('PeerConnection component not found');
                return;
            }

            // Ждем пока peer-connection будет готов
            let attempts = 0;
            const maxAttempts = 10;

            while (attempts < maxAttempts) {
                if (peerConnection.isNodeReady && peerConnection.isNodeReady()) {
                    this.node = peerConnection.getNode();
                    await this._actions.registerGlobalMessageHandler();
                    this.state.connected = true;
                    this.state.peerId = this.node.peerId.toString();
                    this.state.mode = peerConnection.state.mode;

                    log('Node obtained from PeerConnection: %o', {
                        peerId: this.state.peerId,
                        mode: this.state.mode,
                        connected: this.state.connected
                    });

                    // Добавляем обработчик входящих сообщений
                    await this.setupMessageHandler();

                    await this.fullRender(this.state);
                    return;
                }

                log('Waiting for PeerConnection node... (attempt %d/%d)', attempts + 1, maxAttempts);
                await new Promise(resolve => setTimeout(resolve, 1000));
                attempts++;
            }

            throw new Error('PeerConnection node not ready after maximum attempts');

        } catch (error) {
            log.error('Failed to initialize from PeerConnection: %o', error);
            this.addError({
                componentName: this.constructor.name,
                source: 'initializeFromPeerConnection',
                message: 'Не удалось получить ноду из PeerConnection',
                details: error
            });
        }
    }

    /**
     * Обрабатывает входящие сообщения из стрима
     */
    async handleIncomingStreamMessage(messageData, peerId) {
        try {
            log('Processing incoming stream message from %s: %o', peerId, messageData);

            // Если peerId не передан, пытаемся получить из messageData
            const actualPeerId = peerId || messageData.from;

            if (!actualPeerId) {
                log.error('Cannot determine sender peer ID for message: %o', messageData);
                return;
            }

            if (messageData.type === 'private_message') {
                // Обработка приватного сообщения
                await this.handleIncomingPrivateMessage({
                    text: messageData.text,
                    from: actualPeerId,
                    timestamp: messageData.timestamp,
                    isPrivate: true
                });
            } else {
                console.log('----------- !!!!! ---------',this, {
                    text: messageData.text,
                    from: actualPeerId,
                    type: 'received',
                    timestamp: messageData.timestamp || Date.now()
                })
                // Обработка группового сообщения
                await this.addMessage({
                    text: messageData.text,
                    from: actualPeerId,
                    type: 'received',
                    timestamp: messageData.timestamp || Date.now()
                });
            }

        } catch (error) {
            log.error('Error handling incoming stream message: %o', error);
            this.addError({
                componentName: this.constructor.name,
                source: 'handleIncomingStreamMessage',
                message: 'Ошибка обработки входящего сообщения',
                details: {messageData, peerId, error}
            });
        }
    }

    async switchMode(mode) {
        if (this.state.mode !== mode) {
            this.state.mode = mode;
            await this.fullRender(this.state);

            // Переключаем режим через peer-connection
            const peerConnection = await this.getComponentAsync('peer-connection', 'peer-connection');
            if (peerConnection && peerConnection.switchMode) {
                await peerConnection.switchMode(mode);
                // После переключения режима обновляем ноду
                await this.initializeFromPeerConnection();
            }
        }
    }

    async addMessage(message) {
        console.log('----------------- addMessage --------------------------', message)
        this.state.messages.push({
            ...message,
            timestamp: Date.now(),
            id: Math.random().toString(36).substr(2, 9)
        });

        await this.renderPart({
            partName: 'renderMessages',
            state: this.state,
            selector: '#messages-container'
        });

        // const chatInterface = await this.getComponentAsync('chat-interface', 'main-chat');
        // if (chatInterface) {
        //     await chatInterface.addMessage(message);
        // }
    }

    /**
     * Анонсирует создание группы в служебном топике
     * @async
     * @param {Object} group - Информация о группе
     */
    async announceGroupCreation(group) {
        if (!this.node?.services?.pubsub) {
            log.error('Невозможно анонсировать группу: PubSub не доступен');
            return false;
        }

        try {
            const announcement = {
                type: 'GROUP_CREATED',
                data: {
                    id: group.id,
                    name: group.name,
                    topic: group.topic,
                    description: `Группа для общения: ${group.name}`,
                    memberCount: 1,
                    createdAt: group.createdAt,
                    createdBy: this.state.peerId,
                    isPublic: group.isPublic
                },
                timestamp: Date.now(),
                peerId: this.state.peerId
            };

            await this.node.services.pubsub.publish(
                GROUPS_ANNOUNCEMENT_TOPIC,
                new TextEncoder().encode(JSON.stringify(announcement))
            );

            log('Анонс группы опубликован в топике %s: %s', GROUPS_ANNOUNCEMENT_TOPIC, group.name);
            return true;
        } catch (error) {
            log.error('Ошибка анонса группы: %o', error);
            this.addError({
                componentName: this.constructor.name,
                source: 'announceGroupCreation',
                message: 'Не удалось анонсировать группу',
                details: error
            });
            return false;
        }
    }

    /**
     * Сохраняет сообщение в историю по топику
     * @param {Object} message
     */
    async addMessageToTopicHistory(message) {
        if (!this.state.topicHistories) {
            this.state.topicHistories = {};
        }

        const { topic } = message;
        if (!this.state.topicHistories[topic]) {
            this.state.topicHistories[topic] = [];
        }

        // Ограничиваем историю (например, 100 сообщений)
        this.state.topicHistories[topic].push({
            ...message,
            id: Math.random().toString(36).substr(2, 9)
        });

        if (this.state.topicHistories[topic].length > 100) {
            this.state.topicHistories[topic] = this.state.topicHistories[topic].slice(-100);
        }

        // Если топик активен — обновляем текущие сообщения
        if (this.state.currentGroup?.topic === topic) {
            this.state.messages = [...this.state.topicHistories[topic]];
            await this.renderPart({
                partName: 'renderMessages',
                state: this.state,
                selector: '#messages-container'
            });
        }
    }

    async createGroup(groupName) {
        const group = {
            id: Math.random().toString(36).substr(2, 9),
            name: String(groupName).trim() || 'Безымянная группа',
            topic: `chat-group-${String(groupName).replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
            peers: [],
            createdAt: Date.now(),
            isPublic: true
        };

        // Добавляем в "Мои группы"
        // this.state.groups.push(group);

        // Добавляем в "Обнаруженные группы" (включая себя)
        // if (!this.state.discoveredGroups) this.state.discoveredGroups = [];
        // this.state.discoveredGroups.unshift(group); // или push
        // await this._actions.subscribeToGroup(group.topic);
        // await this.announceGroupCreation(group);

        // Обновляем "Мои группы"
        // await this.renderPart({
        //     partName: 'renderMyGroups',
        //     state: this.state,
        //     selector: '#my-groups-container' // ← должен быть в шаблоне
        // });

        // Обновляем "Обнаруженные группы"
        // await this.renderPart({
        //     partName: 'renderDiscoveredGroups',
        //     state: this.state,
        //     selector: '#discovered-groups-container' // ← должен быть в шаблоне
        // });

        const groupManager = await this.getComponentAsync('group-manager', 'group-manager');
        if (groupManager) {
            await groupManager.createGroup(groupName);
        }

        log('Group created: %s (%s)', groupName, group.topic);

        return group;
    }

    async joinGroup(topic, groupName = null) {
        const existingGroup = this.state.groups.find(g => g.topic === topic);

        if (!existingGroup) {
            const group = {
                id: Math.random().toString(36).substr(2, 9),
                name: typeof groupName === 'string' ? groupName.trim() : (typeof topic === 'string' ? topic : 'Безымянная группа'),
                topic: typeof topic === 'string' ? topic : '',
                peers: [],
                joinedAt: Date.now()
            };

            this.state.groups.push(group);
            this.state.currentGroup = group;
        } else {
            this.state.currentGroup = existingGroup;
        }

        await this._actions.subscribeToGroup(topic);

        // Начинаем слушать стрим для этой группы
        await this.setupGroupStream(topic);
        await this.updateGroupMembers(topic)

        if (this.state.topicHistories?.[topic]) {
            this.state.messages = [...this.state.topicHistories[topic]];
        } else {
            this.state.messages = [];
        }

        await this.renderPart({
            partName: 'renderMessages',
            state: this.state,
            selector: '#messages-container'
        });


        const chatInterface = await this.getComponentAsync('chat-interface', 'main-chat');
        if (chatInterface) {
            await chatInterface.setCurrentGroup(this.state.currentGroup);
        }

        log('Joined group: %s (%s)', groupName || topic, topic);
    }

    /**
     * Настройка стрима для группы с использованием lpStream
     */
    async setupGroupStream(topic) {
        if (!this.node) {
            log.error('Node not available for stream setup');
            return;
        }

        try {
            // Получаем список пиров в топике
            const peers = this.node.services.pubsub.getSubscribers(topic);

            for (const peer of peers) {
                if (peer.toString() === this.node.peerId.toString()) {
                    continue; // Пропускаем себя
                }
                const ma = multiaddr(peer)

                // Создаем стрим к пиру
                const stream = await this.node.dialProtocol(ma, '/chat/1.0.0');

                // Создаем lpStream
                const lp = lpStream(stream);

                // Сохраняем стрим
                this.activeStreams.set(`${topic}-${peer.toString()}`, {stream, lp, peer});

                // Запускаем чтение из стрима
                await this.streamToChat(lp, peer.toString(), topic);

                log('Stream setup for peer %s in topic %s', peer.toString(), topic);
            }

        } catch (error) {
            log.error('Error setting up group stream: %o', error);
        }
    }

    /**
     * Чтение сообщений из стрима и вывод в чат
     */
    async streamToChat(lp, peerId, topic) {
        try {
            while (true) {
                const message = await lp.read();

                // Проверяем, что сообщение не пустое
                if (!message || message.length === 0) {
                    log('Empty message from %s, continuing...', peerId);
                    continue;
                }

                const text = uint8ArrayToString(message.subarray());
                log('Message from %s in %s: %s', peerId, topic, text);

                // Парсим JSON или используем как текст
                let messageData;
                try {
                    messageData = JSON.parse(text);
                } catch (e) {
                    messageData = {
                        text: text,
                        type: 'group_message',
                        timestamp: Date.now()
                    };
                }

                // Добавляем сообщение в чат
                await this.addMessage({
                    text: messageData.text,
                    topic: topic,
                    from: peerId,
                    type: 'received',
                    timestamp: messageData.timestamp || Date.now(),
                    isPrivate: messageData.isPrivate || false
                });
            }
        } catch (error) {
            if (error.message.includes('stream closed') ||
                error.code === 'ERR_STREAM_RESET' ||
                error.message.includes('Unexpected EOF')) {
                log('Stream closed for peer %s: %s', peerId, error.message);
            } else {
                log.error('Error reading from stream for peer %s: %o', peerId, error);
            }
            // Удаляем стрим из активных
            this.activeStreams.delete(`${topic}-${peerId}`);
        }
    }

    /**
     * Отправка сообщения через стрим
     */
    async sendMessageViaStream(topic, messageText) {
        if (!this.node || !this.state.currentGroup) {
            log.error('Node or current group not available');
            return false;
        }

        try {
            const peers = this.node.services.pubsub.getSubscribers(topic);
            let sent = false;

            for (const peer of peers) {
                if (peer.toString() === this.node.peerId.toString()) {
                    continue;
                }

                try {
                    const stream = await this.node.dialProtocol(peer, '/chat/1.0.0');
                    const lp = lpStream(stream);

                    // Отправляем как JSON для единообразия
                    const messageData = {
                        type: 'group_message',
                        text: messageText,
                        from: this.state.peerId,
                        timestamp: Date.now(),
                        topic: topic
                    };

                    await lp.write(uint8ArrayFromString(JSON.stringify(messageData)));
                    await stream.close();

                    sent = true;
                    log('Message sent via stream to %s', peer.toString());

                } catch (error) {
                    log.error('Error sending to peer %s: %o', peer.toString(), error);
                }
            }

            // Также отправляем через PubSub для широковещания
            if (this._actions && this._actions.sendMessage) {
                await this._actions.sendMessage(topic, messageText);
            }

            return sent;

        } catch (error) {
            log.error('Error sending message via stream: %o', error);
            return false;
        }
    }

    /**
     * Получает список подключенных пиров с информацией о соединениях
     * @returns {Promise<Array>} Массив подключенных пиров
     */
    async getConnectedPeers(peerId) {
        if (!this.node) return [];
        const peers = await this.node.getPeers();

        const peersWithConnections = [];

        for (const peerId of peers) {
            const connections = this.node.getConnections(peerId);
            if (connections.length > 0) {
                peersWithConnections.push({
                    id: peerId.toString(),
                    connections: connections.map(conn => ({
                        id: conn.id,
                        remoteAddr: conn.remoteAddr ? conn.remoteAddr.toString() : null,
                        status: conn.status
                    }))
                });
            }
        }

        return peersWithConnections;
    }

    async sendPrivateMessage(peerId, messageText) {
        if (!this.node || !this.state.connected) {
            log.error('Node not available for private message');
            throw new Error('P2P нода не готова');
        }

        try {
            // Получаем список подключенных пиров
            const connectedPeers = await this.getConnectedPeers();

            // Ищем пира по ID
            const targetPeer = connectedPeers.find(peer => peer.id === peerId);

            if (!targetPeer) {
                throw new Error(`Пир ${peerId} не найден среди подключенных`);
            }

            // Пытаемся найти любой доступный адрес для подключения
            let targetAddress = null;

            // Сначала проверяем активные соединения
            if (targetPeer.connections && targetPeer.connections.length > 0) {
                for (const connection of targetPeer.connections) {
                    if (connection.remoteAddr) {
                        try {
                            targetAddress = connection.remoteAddr;
                            log('Using active connection address: %s', targetAddress);
                            break;
                        } catch (error) {
                            log.warn('Error parsing connection address: %o', error);
                        }
                    }
                }
            }

            // Если не нашли в активных соединениях, используем peerId для dial
            if (!targetAddress) {
                log('No specific address found, using peer ID for dial: %s', peerId);
                targetAddress = peerId;
            }

            log('Attempting to dial: %s', targetAddress);
            const ma = multiaddr(targetAddress)
            // Создаем стрим к пиру
            const stream = await this.node.dialProtocol(ma, '/chat/1.0.0');
            const lp = lpStream(stream);

            // Отправляем сообщение в формате JSON
            const messageData = {
                type: 'private_message',
                text: messageText,
                from: this.state.peerId,
                timestamp: Date.now(),
                isPrivate: true
            };

            stream.addEventListener('close', () => {
                console.log('Соединение закрыто');
            });

            stream.addEventListener('error', (error) => {
                console.error('Ошибка:', error);
            });

            stream.addEventListener('end', () => {
                console.log('Чтение завершено');
            });

            const messageBytes = uint8ArrayFromString(JSON.stringify(messageData));
            await lp.write(messageBytes);

            log('Приватное сообщение отправлено пользователю: %s', peerId);

            // Добавляем сообщение в локальную историю как отправленное
            await this.addMessage({
                text: messageText,
                to: peerId,
                from: this.state.peerId,
                type: 'sent',
                timestamp: Date.now(),
                isPrivate: true
            });

            return true;

        } catch (error) {
            log.error('Ошибка отправки приватного сообщения: %o', error);

            this.addError({
                componentName: this.constructor.name,
                source: 'sendPrivateMessage',
                message: 'Ошибка отправки приватного сообщения',
                details: {peerId, messageText, error}
            });

            throw error;
        }
    }

    /**
     * Настраивает обработчик входящих сообщений
     */
    async setupMessageHandler() {
        if (!this.node) {
            log.error('Node not available for message handler setup');
            return;
        }

        try {
            // Обработчик для протокола чата
            await this.node.handle('/chat/1.0.0', async (stream, connection) => {
                log('Incoming chat stream established from: %s', connection.remotePeer?.toString());

                try {
                    const lp = lpStream(stream);
                    const remotePeer = connection.remotePeer.toString();

                    while (true) {
                        try {
                            const message = await lp.read();

                            // Проверяем, что сообщение не пустое
                            if (!message || message.length === 0) {
                                log('Empty message received from %s, continuing...', remotePeer);
                                continue;
                            }

                            const messageText = uint8ArrayToString(message.subarray());
                            log('Received length-prefixed message from %s: %s', remotePeer, messageText);

                            let messageData;
                            try {
                                messageData = JSON.parse(messageText);
                            } catch (e) {
                                log('Non-JSON message received, treating as plain text: %s', messageText);
                                messageData = {
                                    text: messageText,
                                    type: 'group_message',
                                    timestamp: Date.now(),
                                    raw: true
                                };
                            }

                            console.log('Получено сообщение:', messageData);
                            await this.handleIncomingStreamMessage(messageData, remotePeer);

                        } catch (readError) {
                            if (readError.message === 'Stream read timeout') {
                                continue;
                            }
                            if (readError.code === 'ERR_STREAM_RESET' || readError.message.includes('stream closed')) {
                                break;
                            }
                            log.error('Error reading from lpStream: %o', readError);
                            break;
                        } finally {
                            // Всегда закрываем стрим
                            await stream.close().catch(() => {
                            });
                        }
                    }
                } catch (error) {
                    if (error.code !== 'ERR_STREAM_RESET' &&
                        !error.message.includes('Stream read timeout') &&
                        !error.message.includes('Unexpected EOF')) {
                        log.error('Error in stream handler for peer %s: %o', connection.remotePeer?.toString(), error);
                    }
                } finally {
                    // Гарантированно закрываем стрим
                    try {
                        await stream.close();
                    } catch (closeError) {
                        log.error('Error closing stream: %o', closeError);
                    }
                }
            });

            log('Chat message handler registered for protocol /chat/1.0.0');

        } catch (error) {
            log.error('Error setting up message handler: %o', error);
            this.addError({
                componentName: this.constructor.name,
                source: 'setupMessageHandler',
                message: 'Ошибка настройки обработчика сообщений',
                details: error
            });
        }
    }

    /**
     * Обработка входящих приватных сообщений
     * @async
     * @param {Object} messageData - Данные сообщения
     */
    async handleIncomingPrivateMessage(messageData) {
        try {
            log('Incoming private message from: %s', messageData.from);

            // Валидация данных сообщения
            if (!messageData.text || !messageData.from) {
                log.error('Invalid private message data: %o', messageData);
                return;
            }

            // Добавляем сообщение в историю как полученное
            await this.addMessage({
                text: messageData.text,
                from: messageData.from,
                to: this.state.peerId,
                type: 'received',
                timestamp: messageData.timestamp || Date.now(),
                isPrivate: true
            });

            console.log('==========================', {
                text: messageData.text,
                from: messageData.from,
                to: this.state.peerId,
                type: 'received',
                timestamp: messageData.timestamp || Date.now(),
                isPrivate: true
            })
            // Передаем сообщение в chat-interface для отображения
            const chatInterface = await this.getComponentAsync('chat-interface', 'main-chat');
            if (chatInterface && chatInterface._actions && chatInterface._actions.handleIncomingPrivateMessage) {
                await chatInterface.postMessage({ type: 'INCOMING_PRIVATE_MESSAGE', data: messageData });
                // await chatInterface._actions.handleIncomingPrivateMessage(messageData);
            }

            log('Private message processed from: %s', messageData.from);

        } catch (error) {
            log.error('Error handling incoming private message: %o', error);
            this.addError({
                componentName: this.constructor.name,
                source: 'handleIncomingPrivateMessage',
                message: 'Ошибка обработки приватного сообщения',
                details: {messageData, error}
            });
        }
    }

    async searchGroups(query) {
        this.state.searchQuery = query;

        const filteredGroups = this.state.groups.filter(group =>
            group.name.toLowerCase().includes(query.toLowerCase()) ||
            group.topic.toLowerCase().includes(query.toLowerCase())
        );

        await this.renderPart({
            partName: 'renderGroupSearch',
            state: {...this.state, filteredGroups},
            selector: '#group-search-results'
        });
    }

    /**
     * Обновляет список участников текущей группы
     */
    async refreshGroupMembers() {
        if (!this.state.currentGroup?.topic) {
            log.error('Нет активной группы для обновления участников');
            return;
        }

        const topic = this.state.currentGroup.topic;
        const peers = this.node?.services?.pubsub?.getSubscribers(topic) || new Set();

        this.state.currentGroupMembers = Array.from(peers).map(id => ({
            id: id.toString(),
            name: generatePeerName(id.toString()),
            online: true
        }));

        await this.renderPart({
            partName: 'renderGroupMembers',
            state: this.state,
            selector: '#group-members-list'
        });

        log('Участники группы обновлены: %d', peers.size);
    }

    async updateGroupMembers(topic) {
        if (!this.node?.services?.pubsub) return [];

        try {
            const peerIds = this.node.services.pubsub.getSubscribers(topic);
            const members = Array.from(peerIds).map(id => ({
                id: id.toString(),
                name: this.generatePeerName(id.toString()),
                online: true
            }));

            // Сохраняем в состоянии
            this.state.currentGroupMembers = members;

            // Обновляем UI
            await this.renderPart({
                partName: 'renderGroupMembers',
                state: this.state,
                selector: '#group-members-list'
            });

            return members;
        } catch (error) {
            this._log.error('Ошибка получения участников группы %s: %o', topic, error);
            return [];
        }
    }

    async sendGroupMessage(messageText) {
        if (this.state.currentGroup && this.state.currentGroup.topic) {
            // Используем стрим для отправки сообщения
            const topic = this.state.currentGroup.topic;

            // 1. Отправляем сообщение в топик через PubSub
            const sent = await this._actions.sendMessage(topic, messageText);
            if (!sent) {
                throw new Error('Не удалось отправить сообщение в группу');
            }

            // Также добавляем сообщение локально как отправленное
            // await this.addMessage({
            //     text: messageText,
            //     topic: this.state.currentGroup.topic,
            //     from: this.state.peerId,
            //     type: 'sent',
            //     timestamp: Date.now()
            // });
        }
    }

    async updateConnectionStatus(connected, peerId = null, addresses = []) {
        this.state.connected = connected;
        if (peerId) this.state.peerId = peerId;
        if (addresses.length > 0) this.state.listeningAddresses = addresses;

        await this.renderPart({
            partName: 'renderConnectionStatus',
            state: this.state,
            selector: '#connection-status'
        });

        const chatInterface = await this.getComponentAsync('chat-interface', 'main-chat');
        if (chatInterface) {
            await chatInterface.updateConnectionStatus(connected);
        }
    }

    async updatePeerList(peers) {
        this.state.connectedPeers = peers;

        await this.renderPart({
            partName: 'renderConnectedPeers',
            state: this.state,
            selector: '#connected-peers-list'
        });
    }

    async connectToPeer(multiaddr) {
        if (this._actions && this._actions.connectToPeer) {
            await this._actions.connectToPeer(multiaddr);
        }
    }

    async getRelayAddresses() {
        return this.state.listeningAddresses.filter(addr =>
            addr.includes('/p2p-circuit') || addr.includes('/webrtc')
        );
    }

    // В классе ChatManager добавляем метод для обработки событий ноды
    async handleNodeEvent(event) {
        const log = logger('chat-manager:node-events');

        try {
            log('Обработка события ноды: %s', event.type);

            switch (event.type) {
                case 'NODE_SHUTDOWN':
                    // Сбрасываем состояние при остановке ноды
                    this.state.connected = false;
                    this.state.peerId = null;
                    this.state.messages = [];
                    this.state.currentGroup = null;
                    this.node = null;

                    log('Состояние ChatManager сброшено после остановки ноды');
                    break;

                case 'NODE_RESTARTED':
                    // Переинициализируем из новой ноды
                    await this.initializeFromPeerConnection();
                    log('ChatManager переинициализирован после перезапуска ноды');
                    break;
            }

            // Обновляем UI
            await this.fullRender(this.state);

        } catch (error) {
            log.error('Ошибка обработки события ноды: %o', error);
            this.addError({
                componentName: this.constructor.name,
                source: 'handleNodeEvent',
                message: 'Ошибка обработки события ноды',
                details: error
            });
        }
    }

    async postMessage(event) {
        try {
            log('ChatManager received message: %s %o', event.type, event.data);

            // Добавляем обработку событий ноды
            if (event.type === 'NODE_SHUTDOWN' || event.type === 'NODE_RESTARTED') {
                await this.handleNodeEvent(event);
                return;
            }

            // Обработка обнаруженных групп от group-manager
            if (event.type === 'GROUPS_DISCOVERED') {
                this.state.discoveredGroups = (event.data.groups || []).map(g => ({
                    ...g,
                    name: typeof g.name === 'string' ? g.name : 'Безымянная группа'
                }));
                await this.renderPart({
                    partName: 'renderDiscoveredGroups',
                    state: this.state,
                    selector: '#discovered-groups-container'
                });
                return;
            }

            switch (event.type) {
                case 'UPDATE_CHAT_HEADER':
                    // Синхронизируем состояние с chat-interface, если нужно
                    if (event.data?.isPrivateChat && event.data.activeMember) {
                        this.state.isPrivateChat = true;
                        this.state.activeMember = event.data.activeMember;
                        this.state.currentGroup = null; // сбрасываем группу
                    } else if (event.data?.currentGroup) {
                        this.state.isPrivateChat = false;
                        this.state.activeMember = null;
                        this.state.currentGroup = event.data.currentGroup;
                    }

                    // Обновляем заголовок
                    await this.renderPart({
                        partName: 'renderActiveChatHeader',
                        state: this.state,
                        selector: '.chat-header'
                    });
                    break;
                case 'SWITCH_MODE':
                    await this.switchMode(event.data.mode);
                    break;
                case 'CREATE_GROUP':
                    await this.createGroup(event.data.groupName);
                    break;
                case 'JOIN_GROUP':
                    // Нормализуем данные
                    const topic = typeof event.data.topic === 'string' ? event.data.topic : '';
                    const groupName = typeof event.data.groupName === 'string' ? event.data.groupName : null;
                    await this.joinGroup(topic, groupName);
                    break;
                case 'SEND_MESSAGE':
                    await this.sendGroupMessage(event.data.message);
                    break;
                case 'SEARCH_GROUPS':
                    await this.searchGroups(event.data.query);
                    break;
                case 'CONNECT_TO_PEER':
                    await this.connectToPeer(event.data.multiaddr);
                    break;
                case 'UPDATE_CONNECTION_STATUS':
                    await this.updateConnectionStatus(
                        event.data.connected,
                        event.data.peerId,
                        event.data.addresses
                    );
                    break;
                case 'UPDATE_PEER_LIST':
                    await this.updatePeerList(event.data.peers);
                    break;
                case 'GROUP_CREATED':
                    // Обработка создания группы из group-manager
                    log('GROUP_CREATED received in ChatManager: %o', event.data);
                    await this.handleGroupCreated(event.data);
                    break;
                case 'PRIVATE_MESSAGE':
                    // Обработка приватных сообщений
                    log('PRIVATE_MESSAGE received in ChatManager: %o', event.data);
                    await this.handleIncomingPrivateMessage(event.data);
                    break;
                case 'SEND_PRIVATE_MESSAGE':
                    // Отправка приватного сообщения
                    log('SEND_PRIVATE_MESSAGE received in ChatManager: %o', event.data);
                    await this.sendPrivateMessage(event.data.peerId, event.data.message);
                    break;
                default:
                    log.error('Неизвестный тип сообщения: %s', event.type);
            }
        } catch (error) {
            log.error('Error processing message in ChatManager: %o', error);
            this.addError({
                componentName: this.constructor.name,
                source: 'postMessage',
                message: 'Ошибка обработки сообщения',
                details: error
            });
        }
    }

    /**
     * Обрабатывает создание новой группы
     * @param {Object} groupData - Данные созданной группы
     */
    async handleGroupCreated(groupData) {
        try {
            log('Handling GROUP_CREATED in ChatManager: %o', groupData);

            // Нормализуем данные группы
            const safeGroup = {
                ...groupData,
                id: groupData.id || groupData.topic || Math.random().toString(36).substr(2, 9),
                name: typeof groupData.name === 'string' ? groupData.name.trim() : 'Безымянная группа',
                topic: typeof groupData.topic === 'string' ? groupData.topic : '',
                joinedAt: Date.now()
            };

            // Добавляем группу в список групп
            if (!this.state.groups.find(g => g.id === safeGroup.id)) {
                this.state.groups.push(safeGroup);
            }

            // Автоматически присоединяемся к созданной группу
            await this.joinGroup(safeGroup.topic, safeGroup.name);

            // Обновляем UI списка групп
            await this.renderPart({
                partName: 'renderGroups',
                state: this.state,
                selector: '#my-groups-container'
            });

            log('Successfully handled GROUP_CREATED and joined the group');

        } catch (error) {
            log.error('Error handling GROUP_CREATED: %o', error);
            this.addError({
                componentName: this.constructor.name,
                source: 'handleGroupCreated',
                message: 'Ошибка обработки создания группы',
                details: error
            });
        }
    }

    async _componentAttributeChanged(name, oldValue, newValue) {
        if (name === 'mode' && oldValue !== newValue) {
            await this.switchMode(newValue);
        }
    }

    async _componentDisconnected() {
        // Закрываем все активные стримы
        for (const [key, streamData] of this.activeStreams.entries()) {
            try {
                await streamData.stream.close();
            } catch (error) {
                log.error('Error closing stream %s: %o', key, error);
            }
        }
        this.activeStreams.clear();

        if (this._controller && this._controller.destroy) {
            await this._controller.destroy();
        }
        this._templateMethods = null;
    }
}

if (!customElements.get('chat-manager')) {
    customElements.define('chat-manager', ChatManager);
}
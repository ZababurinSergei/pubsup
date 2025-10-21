import { BaseComponent } from '../../base/base-component.mjs';
import * as template from './template/index.mjs';
import { controller } from './controller/index.mjs';
import { createActions } from './actions/index.mjs';
import { lpStream } from '@libp2p/utils';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';
import { logger } from '@libp2p/logger';

// Создаем логгер для компонента
const log = logger('chat-manager');

export class ChatManager extends BaseComponent {
    constructor() {
        super();
        this._templateMethods = template;
        this.state = {
            mode: 'listener',
            connected: false,
            messages: [],
            currentGroup: null,
            groups: [],
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
                log.warn('PeerConnection component not found');
                return;
            }

            // Ждем пока peer-connection будет готов
            let attempts = 0;
            const maxAttempts = 10;

            while (attempts < maxAttempts) {
                if (peerConnection.isNodeReady && peerConnection.isNodeReady()) {
                    this.node = peerConnection.getNode();
                    this.state.connected = true;
                    this.state.peerId = this.node.peerId.toString();
                    this.state.mode = peerConnection.state.mode;

                    log('Node obtained from PeerConnection: %o', {
                        peerId: this.state.peerId,
                        mode: this.state.mode,
                        connected: this.state.connected
                    });

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

        const chatInterface = await this.getComponentAsync('chat-interface', 'main-chat');
        if (chatInterface) {
            await chatInterface.addMessage(message);
        }
    }

    async createGroup(groupName) {
        const group = {
            id: Math.random().toString(36).substr(2, 9),
            name: groupName,
            topic: `chat-group-${groupName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
            peers: [],
            createdAt: Date.now(),
            isPublic: true
        };

        this.state.groups.push(group);

        await this._actions.subscribeToGroup(group.topic);

        await this.renderPart({
            partName: 'renderGroups',
            state: this.state,
            selector: '#groups-container'
        });

        const groupManager = await this.getComponentAsync('group-manager', 'main-group-manager');
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
                name: groupName || topic,
                topic: topic,
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

        await this.fullRender(this.state);

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
            log.warn('Node not available for stream setup');
            return;
        }

        try {
            // Получаем список пиров в топике
            const peers = this.node.services.pubsub.getSubscribers(topic);

            for (const peer of peers) {
                if (peer.toString() === this.node.peerId.toString()) {
                    continue; // Пропускаем себя
                }

                // Создаем стрим к пиру
                const stream = await this.node.dialProtocol(peer, '/chat/1.0.0');

                // Создаем lpStream
                const lp = lpStream(stream);

                // Сохраняем стрим
                this.activeStreams.set(`${topic}-${peer.toString()}`, { stream, lp, peer });

                // Запускаем чтение из стрима
                this.streamToChat(lp, peer.toString(), topic);

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
                const text = uint8ArrayToString(message.subarray());

                log('Message from %s in %s: %s', peerId, topic, text);

                // Добавляем сообщение в чат
                await this.addMessage({
                    text: text,
                    topic: topic,
                    from: peerId,
                    type: 'received',
                    timestamp: Date.now()
                });

            }
        } catch (error) {
            log.error('Error reading from stream for peer %s: %o', peerId, error);
            // Удаляем стрим из активных
            this.activeStreams.delete(`${topic}-${peerId}`);
        }
    }

    /**
     * Отправка сообщения через стрим
     */
    async sendMessageViaStream(topic, messageText) {
        if (!this.node || !this.state.currentGroup) {
            log.warn('Node or current group not available');
            return false;
        }

        try {
            const peers = this.node.services.pubsub.getSubscribers(topic);
            let sent = false;

            for (const peer of peers) {
                if (peer.toString() === this.node.peerId.toString()) {
                    continue;
                }

                const streamKey = `${topic}-${peer.toString()}`;
                let streamData = this.activeStreams.get(streamKey);

                // Если стрима нет, создаем его
                if (!streamData) {
                    const stream = await this.node.dialProtocol(peer, '/chat/1.0.0');
                    const lp = lpStream(stream);
                    streamData = { stream, lp, peer };
                    this.activeStreams.set(streamKey, streamData);

                    // Запускаем чтение из нового стрима
                    this.streamToChat(lp, peer.toString(), topic);
                }

                // Отправляем сообщение через lpStream
                await streamData.lp.write(uint8ArrayFromString(messageText));
                sent = true;

                log('Message sent via stream to %s', peer.toString());
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

    async searchGroups(query) {
        this.state.searchQuery = query;

        const filteredGroups = this.state.groups.filter(group =>
            group.name.toLowerCase().includes(query.toLowerCase()) ||
            group.topic.toLowerCase().includes(query.toLowerCase())
        );

        await this.renderPart({
            partName: 'renderGroupSearch',
            state: { ...this.state, filteredGroups },
            selector: '#group-search-results'
        });
    }

    async sendGroupMessage(messageText) {
        if (this.state.currentGroup && this.state.currentGroup.topic) {
            // Используем стрим для отправки сообщения
            await this.sendMessageViaStream(this.state.currentGroup.topic, messageText);

            // Также добавляем сообщение локально как отправленное
            await this.addMessage({
                text: messageText,
                topic: this.state.currentGroup.topic,
                from: this.state.peerId,
                type: 'sent',
                timestamp: Date.now()
            });
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

    async postMessage(event) {
        try {
            log('ChatManager received message: %s %o', event.type, event.data);

            switch (event.type) {
                case 'SWITCH_MODE':
                    await this.switchMode(event.data.mode);
                    break;
                case 'CREATE_GROUP':
                    await this.createGroup(event.data.groupName);
                    break;
                case 'JOIN_GROUP':
                    await this.joinGroup(event.data.topic, event.data.groupName);
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
                default:
                    log.warn('Неизвестный тип сообщения: %s', event.type);
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

            // Добавляем группу в список групп
            if (!this.state.groups.find(g => g.id === groupData.id)) {
                this.state.groups.push({
                    ...groupData,
                    joinedAt: Date.now()
                });
            }

            // Автоматически присоединяемся к созданной группе
            await this.joinGroup(groupData.topic, groupData.name);

            // Обновляем UI списка групп
            await this.renderPart({
                partName: 'renderGroups',
                state: this.state,
                selector: '#groups-container'
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
                log.warn('Error closing stream %s: %o', key, error);
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
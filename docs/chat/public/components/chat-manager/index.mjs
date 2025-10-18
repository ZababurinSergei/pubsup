import { BaseComponent } from '../../base/base-component.mjs';
import * as template from './template/index.mjs';
import { controller } from './controller/index.mjs';
import { createActions } from './actions/index.mjs';

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
    }

    async _componentReady() {
        this._controller = await controller(this);
        this._actions = await createActions(this);
        // await this._controller.init();

        // await this._actions.initializeLibp2p(this.state.mode);

        return true;
    }

    async switchMode(mode) {
        if (this.state.mode !== mode) {
            this.state.mode = mode;
            await this.fullRender(this.state);

            if (this._actions.cleanup) {
                await this._actions.cleanup();
            }

            await this._actions.initializeLibp2p(mode);
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

        const chatInterface = await this.getComponentAsync('chat-interface', 'main-chat-interface');
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

        await this.fullRender(this.state);

        const chatInterface = await this.getComponentAsync('chat-interface', 'main-chat-interface');
        if (chatInterface) {
            await chatInterface.setCurrentGroup(this.state.currentGroup);
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
        if (this.state.currentGroup && this._actions) {
            await this._actions.sendMessage(this.state.currentGroup.topic, messageText);
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

        const chatInterface = await this.getComponentAsync('chat-interface', 'main-chat-interface');
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
                default:
                    console.warn(`[ChatManager] Неизвестный тип сообщения: ${event.type}`);
            }
        } catch (error) {
            this.addError({
                componentName: this.constructor.name,
                source: 'postMessage',
                message: 'Ошибка обработки сообщения',
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
        if (this._controller && this._controller.destroy) {
            await this._controller.destroy();
        }
        if (this._actions && this._actions.cleanup) {
            await this._actions.cleanup();
        }
        this._templateMethods = null;
    }
}

if (!customElements.get('chat-manager')) {
    customElements.define('chat-manager', ChatManager);
}
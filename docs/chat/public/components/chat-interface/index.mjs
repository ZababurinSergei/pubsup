import { BaseComponent } from '../../base/base-component.mjs';
import * as template from './template/index.mjs';
import { controller } from './controller/index.mjs';
import { createActions } from './actions/index.mjs';

export class ChatInterface extends BaseComponent {
    constructor() {
        super();
        this._templateMethods = template;
        this.state = {
            messages: [],
            currentMessage: '',
            connected: false,
            currentGroup: null,
            connectedPeers: [],
            totalPeers: 0,
            peerId: null,
            connectionMode: null,
            uptime: null
        };
    }

    async _componentReady() {
        this._controller = await controller(this);
        this._actions = await createActions(this);
        await this.fullRender(this.state)
        await this._controller.init();
        return true;
    }

    async addMessage(message) {
        this.state.messages.push({
            ...message,
            timestamp: Date.now(),
            id: Math.random().toString(36).substr(2, 9)
        });

        // Сохраняем только последние 100 сообщений
        if (this.state.messages.length > 100) {
            this.state.messages = this.state.messages.slice(-100);
        }

        await this.renderPart({
            partName: 'renderMessages',
            state: this.state,
            selector: '#messages-list'
        });

        // Автоскролл к последнему сообщению
        const messagesContainer = this.shadowRoot.querySelector('#messages-list');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    async setCurrentGroup(group) {
        this.state.currentGroup = group;
        this.state.messages = [];
        await this.fullRender(this.state);
    }

    async updateConnectionStatus(connected) {
        this.state.connected = connected;
        await this.renderPart({
            partName: 'renderStatus',
            state: this.state,
            selector: '#connection-status'
        });
    }

    async clearMessages() {
        this.state.messages = [];
        await this.renderPart({
            partName: 'renderMessages',
            state: this.state,
            selector: '#messages-list'
        });
    }

    async postMessage(event) {
        try {
            console.log('📨 ChatInterface received message:', event.type, event.data);

            switch (event.type) {
                case 'PEERS_UPDATE':
                    await this.handlePeersUpdate(event.data);
                    break;

                case 'CONNECTION_STATUS_UPDATE':
                    await this.handleConnectionStatusUpdate(event.data);
                    break;

                case 'INCOMING_MESSAGE':
                    await this.handleIncomingMessage(event.data);
                    break;

                default:
                    console.warn(`[ChatInterface] Неизвестный тип сообщения: ${event.type}`);
            }
        } catch (error) {
            console.error('❌ Error processing message in ChatInterface:', error);
            this.addError({
                componentName: this.constructor.name,
                source: 'postMessage',
                message: 'Ошибка обработки сообщения',
                details: error
            });
        }
    }

    /**
     * Обрабатывает обновление списка пиров
     * @param {Object} data - Данные о пирах
     */
    async handlePeersUpdate(data) {
        try {
            console.log('👥 Handling peers update:', data);

            // Обновляем состояние с информацией о пирах
            this.state.connectedPeers = data.peers || [];
            this.state.totalPeers = data.totalPeers || 0;

            // Обновляем отображение статуса подключения
            await this.updateConnectionStatusDisplay();

            // Обновляем список участников если открыта панель
            await this.updateMembersList();

            console.log('✅ Peers data processed in chat interface');

        } catch (error) {
            console.error('❌ Error handling peers update:', error);
        }
    }

    /**
     * Обрабатывает обновление статуса соединения
     * @param {Object} data - Данные о соединении
     */
    async handleConnectionStatusUpdate(data) {
        try {
            console.log('🔗 Handling connection status update:', data);

            // Обновляем состояние соединения
            this.state.connected = data.connected;
            this.state.peerId = data.peerId;
            this.state.connectionMode = data.mode;
            this.state.uptime = data.uptime;

            // Обновляем отображение статуса
            await this.updateConnectionStatusDisplay();

            console.log('✅ Connection status updated in chat interface');

        } catch (error) {
            console.error('❌ Error handling connection status:', error);
        }
    }

    /**
     * Обновляет отображение статуса подключения
     */
    async updateConnectionStatusDisplay() {
        try {
            const statusElement = this.shadowRoot.querySelector('#connection-status');
            if (statusElement && this.renderPart) {
                await this.renderPart({
                    partName: 'renderConnectionStatus',
                    state: this.state,
                    selector: '#connection-status'
                });
            }
        } catch (error) {
            console.error('❌ Error updating connection status display:', error);
        }
    }

    /**
     * Обновляет список участников в боковой панели
     */
    async updateMembersList() {
        try {
            const membersPanel = this.shadowRoot.querySelector('#members-panel');
            if (membersPanel && this.renderPart) {
                await this.renderPart({
                    partName: 'renderMembersList',
                    state: this.state,
                    selector: '.members-list'
                });
            }
        } catch (error) {
            console.error('❌ Error updating members list:', error);
        }
    }

    async _componentDisconnected() {
        if (this._controller && this._controller.destroy) {
            await this._controller.destroy();
        }
        this._templateMethods = null;
    }
}

if (!customElements.get('chat-interface')) {
    customElements.define('chat-interface', ChatInterface);
}
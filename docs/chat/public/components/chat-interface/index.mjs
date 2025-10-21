import { BaseComponent } from '../../base/base-component.mjs';
import * as template from './template/index.mjs';
import { controller } from './controller/index.mjs';
import { createActions } from './actions/index.mjs';
import { logger } from '@libp2p/logger';

export class ChatInterface extends BaseComponent {
    constructor() {
        super();
        this._templateMethods = template;
        this._log = logger('chat-interface');
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
        this._log('компонент готов');
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

        this._log('сообщение добавлено: %s', message.text?.substring(0, 50));
    }

    async setCurrentGroup(group) {
        this.state.currentGroup = group;
        this.state.messages = [];
        this._log('установлена текущая группа: %s', group?.name);
        await this.fullRender(this.state);
    }

    async updateConnectionStatus(connected) {
        this.state.connected = connected;
        await this.renderPart({
            partName: 'renderStatus',
            state: this.state,
            selector: '#connection-status'
        });
        this._log('статус подключения обновлен: %s', connected ? 'подключено' : 'не подключено');
    }

    async clearMessages() {
        this.state.messages = [];
        await this.renderPart({
            partName: 'renderMessages',
            state: this.state,
            selector: '#messages-list'
        });
        this._log('история сообщений очищена');
    }

    async postMessage(event) {
        try {
            this._log('📨 получено сообщение: %s %o', event.type, event.data);

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
                    this._log.error('неизвестный тип сообщения: %s', event.type);
            }
        } catch (error) {
            this._log.error('❌ ошибка обработки сообщения: %o', error);
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
            this._log('👥 обработка обновления пиров: %o', data);

            // Обновляем состояние с информацией о пирах
            this.state.connectedPeers = data.peers || [];
            this.state.totalPeers = data.totalPeers || 0;

            // Обновляем отображение статуса подключения
            await this.updateConnectionStatusDisplay();

            // Обновляем список участников если открыта панель
            await this.updateMembersList();

            this._log('✅ данные пиров обработаны');

        } catch (error) {
            this._log.error('❌ ошибка обработки обновления пиров: %o', error);
        }
    }

    /**
     * Обрабатывает обновление статуса соединения
     * @param {Object} data - Данные о соединении
     */
    async handleConnectionStatusUpdate(data) {
        try {
            this._log('🔗 обработка обновления статуса соединения: %o', data);

            // Обновляем состояние соединения
            this.state.connected = data.connected;
            this.state.peerId = data.peerId;
            this.state.connectionMode = data.mode;
            this.state.uptime = data.uptime;

            // Обновляем отображение статуса
            await this.updateConnectionStatusDisplay();

            this._log('✅ статус соединения обновлен');

        } catch (error) {
            this._log.error('❌ ошибка обработки статуса соединения: %o', error);
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
                this._log.trace('отображение статуса подключения обновлено');
            }
        } catch (error) {
            this._log.error('❌ ошибка обновления отображения статуса: %o', error);
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
                this._log.trace('список участников обновлен');
            }
        } catch (error) {
            this._log.error('❌ ошибка обновления списка участников: %o', error);
        }
    }

    async _componentDisconnected() {
        if (this._controller && this._controller.destroy) {
            await this._controller.destroy();
        }
        this._templateMethods = null;
        this._log('компонент отключен');
    }
}

if (!customElements.get('chat-interface')) {
    customElements.define('chat-interface', ChatInterface);
}
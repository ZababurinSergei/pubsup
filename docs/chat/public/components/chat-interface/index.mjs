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
            uptime: null,
            activeMember: null,        // Активный пользователь для приватного чата
            isPrivateChat: false       // Флаг приватного чата
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
        this.state.activeMember = null;
        this.state.isPrivateChat = false;
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

                case 'INCOMING_PRIVATE_MESSAGE':
                    await this.handleIncomingPrivateMessage(event.data);
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

    /**
     * Установка активного пользователя для приватного чата
     * @param {Object} member - Данные пользователя
     */
    async setActiveMember(member) {
        this.state.activeMember = member;
        this.state.isPrivateChat = true;
        this.state.messages = []; // Очищаем историю при смене чата

        await this.updateMembersList();
        await this.updateChatHeader();
        await this.renderPart({
            partName: 'renderMessages',
            state: this.state,
            selector: '#messages-list'
        });

        this._log('активный пользователь установлен: %s', member.name);
    }

    /**
     * Обновляет заголовок чата
     */
    async updateChatHeader() {
        try {
            const chatHeader = this.shadowRoot.querySelector('.chat-header');
            if (chatHeader && this.renderPart) {
                await this.renderPart({
                    partName: 'renderChatHeader',
                    state: this.state,
                    selector: '.chat-header'
                });
            }
        } catch (error) {
            this._log.error('ошибка обновления заголовка чата: %o', error);
        }
    }

    /**
     * Обработка входящего приватного сообщения
     * @param {Object} messageData - Данные сообщения
     */
    async handleIncomingPrivateMessage(messageData) {
        try {
            // Проверяем, относится ли сообщение к текущему активному приватному чату
            const isForActiveChat = this.state.isPrivateChat &&
                this.state.activeMember &&
                messageData.from === this.state.activeMember.id;

            // Или если это новое сообщение и у нас нет активного чата
            const shouldActivateChat = !this.state.isPrivateChat &&
                messageData.isPrivate;

            if (isForActiveChat || shouldActivateChat) {
                this._log('обработка входящего приватного сообщения от: %s', messageData.from);

                // Если это новое сообщение, активируем чат с отправителем
                if (shouldActivateChat) {
                    const senderMember = this.state.connectedPeers.find(p => p.id === messageData.from);
                    if (senderMember) {
                        await this.setActiveMember(senderMember);
                    }
                }

                // Добавляем сообщение в историю
                await this.addMessage({
                    text: messageData.text,
                    from: messageData.from,
                    to: this.state.peerId,
                    type: 'received',
                    timestamp: messageData.timestamp || Date.now(),
                    isPrivate: true
                });

                // Показываем уведомление если окно не активно
                if (document.hidden && this.state.activeMember) {
                    this.showNotification(`Приватное сообщение от ${this.state.activeMember.name}`);
                }
            } else if (messageData.isPrivate) {
                // Сообщение не для активного чата - просто логируем
                this._log('приватное сообщение от %s не для активного чата', messageData.from);
            }

        } catch (error) {
            this._log.error('ошибка обработки входящего приватного сообщения: %o', error);
            this.addError({
                componentName: this.constructor.name,
                source: 'handleIncomingPrivateMessage',
                message: 'Ошибка обработки приватного сообщения',
                details: { messageData, error }
            });
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
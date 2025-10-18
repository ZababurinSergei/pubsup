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
            currentGroup: null
        };
    }

    async _componentReady() {
        this._controller = await controller(this);
        this._actions = await createActions(this);
        // await this._controller.init();
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
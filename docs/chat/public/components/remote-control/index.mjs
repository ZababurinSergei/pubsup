// /10/public/components/remote-control/index.mjs
import { BaseComponent } from '../../base/base-component.mjs';
import * as template from './template/index.mjs';
import { controller } from './controller/index.mjs';
import { createActions } from './actions/index.mjs';
import { logger } from '@libp2p/logger';

const log = logger('remote-control');

export class RemoteControl extends BaseComponent {
    static observedAttributes = ['target-peer', 'mode']; // 'viewer' | 'controller'

    constructor() {
        super();
        this._templateMethods = template;
        this.state = {
            mode: 'viewer', // или 'controller'
            targetPeer: null,
            isConnected: false,
            isCdpAvailable: false,
            cursorPosition: { x: 0, y: 0 },
            eventsQueue: []
        };
    }

    async _componentReady() {
        this._controller = await controller(this);
        this._actions = await createActions(this);
        await this.fullRender(this.state);
        await this._controller.init();
    }

    // Проверка, установлено ли расширение
    async isCdpExtensionAvailable() {
        const extensionId = 'ваш-extension-id'; // см. ниже
        try {
            const response = await chrome.runtime.sendMessage(extensionId, { ping: true });
            return !!response;
        } catch (e) {
            return false;
        }
    }

    async _componentAttributeChanged(name, oldValue, newValue) {
        if (name === 'mode') {
            this.state.mode = newValue;
            await this.fullRender(this.state);
        }
        if (name === 'target-peer') {
            this.state.targetPeer = newValue;
            // Подписка на входящие события управления
            if (this.state.mode === 'viewer') {
                await this._actions.setupInputListener();
            }
        }
    }

    async _componentDisconnected() {
        if (this._controller?.destroy) await this._controller.destroy();
        if (this._actions?.cleanup) await this._actions.cleanup();
    }
}

if (!customElements.get('remote-control')) {
    customElements.define('remote-control', RemoteControl);
}
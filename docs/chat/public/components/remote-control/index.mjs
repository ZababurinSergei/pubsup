// /10/public/components/remote-control/index.mjs
import { BaseComponent } from '../../base/base-component.mjs';
import * as template from './template/index.mjs';
import { controller } from './controller/index.mjs';
import { createActions } from './actions/index.mjs';
import { logger } from '@libp2p/logger';
import { lpStream } from '@libp2p/utils'
import {toString as uint8ArrayToString} from 'uint8arrays/to-string';


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

    // В классе RemoteControl
    async setStream(stream) {
        log('Установка стрима для remote-control в режиме %s', this.state.mode);

        if (!stream) {
            log.error('Попытка установить пустой стрим');
            return;
        }

        this._remoteStream = stream;
        this.state.isConnected = true;

        // Обновляем UI (статус подключения)
        await this.renderPart({
            partName: 'defaultTemplate',
            state: this.state,
            selector: '#root',
            method: 'innerHTML'
        });

        // Подписываемся на события ввода (если viewer)
        if (this.state.mode === 'viewer') {
            this._startReadingStream(stream);
        }
    }

    async _startReadingStream(stream) {
        const lp = lpStream(stream);
        try {
            while (true) {
                const message = await lp.read();
                if (!message || message.length === 0) continue;

                const text = uint8ArrayToString(message.subarray());
                let eventData;
                try {
                    eventData = JSON.parse(text);
                } catch (e) {
                    log.error('Некорректное сообщение в remote-control стриме:', text);
                    continue;
                }

                if (eventData.type === 'REMOTE_CONTROL_EVENT') {
                    // Передаём событие в действия компонента
                    if (this._actions?.handleInputEvent) {
                        await this._actions.handleInputEvent(eventData.payload);
                    }
                }
            }
        } catch (err) {
            if (err.message !== 'stream closed' && err.code !== 'ERR_STREAM_RESET') {
                log.error('Ошибка чтения remote-control стрима:', err);
            }
            this.state.isConnected = false;
            await this.renderPart({
                partName: 'defaultTemplate',
                state: this.state,
                selector: ':host',
                method: 'innerHTML'
            });
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
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
            mode: null, // или 'controller'
            targetPeer: null,
            isConnected: false,
            isCdpAvailable: false,
            cursorPosition: { x: 0, y: 0 },
            eventsQueue: [],
            focusOnCursor: true // ← управляется через UI (чекбокс/кнопка)
        };
    }

    async _componentReady() {
        // debugger
        this._controller = await controller(this);
        this._actions = await createActions(this);
        this.state.mode = this.getAttribute('mode')
        await this.fullRender(this.state);
        await this._controller.init();
    }

    async postMessage(event) {
        if (event.type === 'WEBRTC_OFFER_RECEIVED') {
            await this.handleWebRtcOffer(event.data);
        }
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

    /**
     * Обрабатывает WebRTC offer от viewer (запрос на передачу экрана)
     * Вызывается в режиме "controller"
     * @param {Object} offerData - { sdp: string, from: string }
     */
    async handleWebRtcOffer(offerData) {
        const log = logger('remote-control:webrtc:controller');
        try {
            if (this.state.mode !== 'controller') {
                throw new Error('handleWebRtcOffer допустим только в режиме controller');
            }

            // Создаём RTCPeerConnection (без ICE-серверов — соединение уже через libp2p)
            const pc = new RTCPeerConnection({ iceServers: [] });

            // Обработка входящего видео от viewer
            pc.ontrack = (event) => {
                const remoteVideo = this.shadowRoot.querySelector('#remote-video');
                if (remoteVideo) {
                    remoteVideo.srcObject = event.streams[0];
                    log('Видео от viewer получено и отображается');
                }
            };

            // Устанавливаем удалённое описание (offer от viewer)
            await pc.setRemoteDescription(
                new RTCSessionDescription({ type: 'offer', sdp: offerData.sdp })
            );

            // Создаём и отправляем ответ (answer)
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            // Сохраняем соединение
            this._videoPeerConnection = pc;

            // Отправляем answer обратно viewer через приватное сообщение
            const chatManager = await this.getComponentAsync('chat-manager', 'chat-manager');
            if (!chatManager) throw new Error('chat-manager недоступен');

            await chatManager.sendPrivateMessage(offerData.from, JSON.stringify({
                type: 'REMOTE_CONTROL_EVENT',
                payload: {
                    type: 'VIDEO_SDP',
                    sdpType: 'answer',
                    sdp: answer.sdp,
                    targetPeer: offerData.from,
                    timestamp: Date.now()
                }
            }));

            log('WebRTC answer отправлен viewer: %s', offerData.from);

        } catch (err) {
            log.error('Ошибка обработки WebRTC offer в controller:', err);
            this.addError({
                componentName: 'RemoteControl',
                source: 'handleWebRtcOffer',
                message: 'Не удалось обработать WebRTC offer от viewer',
                details: err
            });
        }
    }

    async handleIceCandidate(candidateData) {
        if (!this._videoPeerConnection) {
            log.error('RTCPeerConnection не инициализирован, игнорируем кандидат');
            return;
        }

        try {
            await this._videoPeerConnection.addIceCandidate(new RTCIceCandidate(candidateData));
            log('ICE-кандидат успешно добавлен:', candidateData);
        } catch (err) {
            log.error('Ошибка добавления ICE-кандидата:', err);
        }
    }
    /**
     * Обрабатывает входящий WebRTC SDP-ответ (answer)
     * @param {Object} answerData - { sdp: string }
     */
    async handleWebRtcAnswer(answerData) {
        const log = logger('remote-control:webrtc');
        try {
            if (!this._videoPeerConnection) {
                log.error('RTCPeerConnection не инициализирован');
                return;
            }

            // Устанавливаем удалённое описание (answer)
            await this._videoPeerConnection.setRemoteDescription(
                new RTCSessionDescription({
                    type: 'answer',
                    sdp: answerData.sdp
                })
            );

            log('WebRTC answer успешно применён');

            // Необязательно: установка обработчика ontrack для отображения стрима
            this._videoPeerConnection.ontrack = (event) => {
                const remoteVideo = this.shadowRoot.querySelector('#remote-video');
                if (remoteVideo) {
                    remoteVideo.srcObject = event.streams[0];
                }
            };

        } catch (err) {
            log.error('Ошибка обработки WebRTC-ответа:', err);
            this.addError({
                componentName: 'RemoteControl',
                source: 'handleWebRtcAnswer',
                message: 'Не удалось обработать WebRTC answer',
                details: err
            });
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
            await this._startReadingStream(stream);
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
                selector: '#root',
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
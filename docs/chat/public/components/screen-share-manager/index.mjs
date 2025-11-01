// /10/public/components/screen-share-manager/index.mjs
import { BaseComponent } from '../../base/base-component.mjs';
import * as template from './template/index.mjs';
import { controller } from './controller/index.mjs';
import { createActions } from './actions/index.mjs';
import { logger } from '@libp2p/logger';

const log = logger('screen-share-manager');

export class ScreenShareManager extends BaseComponent {
    constructor() {
        super();
        this._templateMethods = template;
        this._log = log;
        this.state = {
            connectedPeers: [],
            activeSession: null, // { targetPeerId, pc, stream }
            isSharing: false,
            error: null
        };
    }

    async _componentReady() {
        this._controller = await controller(this);
        this._actions = await createActions(this);
        await this.fullRender(this.state);
        await this._controller.init();
    }

    async _componentDisconnected() {
        if (this._controller?.destroy) await this._controller.destroy();
        if (this.state.activeSession?.pc) {
            this.state.activeSession.pc.close();
        }
    }

    // Получение списка пиров от peer-connection
    async updatePeers(peers) {
        this.state.connectedPeers = peers;
        await this.renderPart({
            partName: 'renderPeerList',
            state: this.state,
            selector: '#peer-list'
        });
    }

    // Запуск демонстрации экрана
    async startScreenShare(targetPeerId) {
        if (this.state.isSharing) {
            this._log.warn('Уже идёт трансляция');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: 'always' },
                audio: false
            });

            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });

            stream.getTracks().forEach(track => pc.addTrack(track, stream));

            // Обмен SDP через существующий libp2p-стрим
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            const peerConnection = await this.getComponentAsync('peer-connection', 'peer-connection');
            if (!peerConnection) throw new Error('peer-connection не найден');

            // Отправка offer через P2P-стрим
            await peerConnection.sendPrivateMessage(targetPeerId, JSON.stringify({
                type: 'screen-share-offer',
                sdp: offer.sdp
            }));

            pc.onicecandidate = async (event) => {
                if (event.candidate) {
                    await peerConnection.sendPrivateMessage(targetPeerId, JSON.stringify({
                        type: 'ice-candidate',
                        candidate: event.candidate
                    }));
                }
            };

            this.state.activeSession = { targetPeerId, pc, stream };
            this.state.isSharing = true;
            await this.renderPart({
                partName: 'renderStatus',
                state: this.state,
                selector: '#share-status'
            });

        } catch (err) {
            this._log.error('Ошибка запуска screen share:', err);
            this.addError({
                componentName: this.constructor.name,
                source: 'startScreenShare',
                message: 'Не удалось начать трансляцию экрана',
                details: err
            });
        }
    }

    // Обработка входящего запроса на трансляцию
    async handleIncomingMessage(messageData, fromPeerId) {
        if (typeof messageData !== 'object') return;

        const { type } = messageData;

        if (type === 'screen-share-offer') {
            await this._handleOffer(messageData.sdp, fromPeerId);
        } else if (type === 'ice-candidate' && this.state.activeSession?.pc) {
            await this.state.activeSession.pc.addIceCandidate(new RTCIceCandidate(messageData.candidate));
        }
    }

    async _handleOffer(sdp, fromPeerId) {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        pc.ontrack = (event) => {
            const remoteVideo = this.shadowRoot.querySelector('#remote-screen');
            if (remoteVideo) {
                remoteVideo.srcObject = event.streams[0];
                remoteVideo.play().catch(console.error);
            }
        };

        await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp }));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        const peerConnection = await this.getComponentAsync('peer-connection', 'peer-connection');
        await peerConnection.sendPrivateMessage(fromPeerId, JSON.stringify({
            type: 'screen-share-answer',
            sdp: answer.sdp
        }));

        pc.onicecandidate = async (event) => {
            if (event.candidate) {
                await peerConnection.sendPrivateMessage(fromPeerId, JSON.stringify({
                    type: 'ice-candidate',
                    candidate: event.candidate
                }));
            }
        };

        this.state.activeSession = { targetPeerId: fromPeerId, pc, stream: null };
        this.state.isSharing = false; // Мы получаем, не транслируем
        await this.renderPart({
            partName: 'renderStatus',
            state: this.state,
            selector: '#share-status'
        });
    }
}

if (!customElements.get('screen-share-manager')) {
    customElements.define('screen-share-manager', ScreenShareManager);
}
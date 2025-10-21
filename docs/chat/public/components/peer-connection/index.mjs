import { BaseComponent } from '../../base/base-component.mjs';
import * as template from './template/index.mjs';
import { controller } from './controller/index.mjs';
import { createActions } from './actions/index.mjs';

export class PeerConnection extends BaseComponent {
    constructor() {
        super();
        this._templateMethods = template;
        this.node = null
        this.state = {
            mode: 'listener',
            connected: false,
            peerId: null,
            listeningAddresses: [],
            connectedPeers: [],
            relayEnabled: true
        };
    }

    async _componentReady() {
        console.log('🔧 PeerConnection component ready');

        this._controller = await controller(this);
        this._actions = await createActions(this);

        console.log('🔧 Controller and actions created:', {
            hasController: !!this._controller,
            hasActions: !!this._actions
        });

        await this._controller.init();

        // Автоматически инициализируем начальный режим
        this.node = await this.initializeLibp2p(this.state.mode);

        return true;
    }

    async initializeLibp2p(mode = 'listener') {
        console.log('🚀 initializeLibp2p called with mode:', mode);

        this.state.mode = mode;
        this.state.connected = false;

        try {
            const libp2p = await this._actions.initializeLibp2p(mode);
            this.state.peerId = libp2p.peerId.toString();
            this.state.listeningAddresses = libp2p.getMultiaddrs().map(ma => ma.toString());
            this.state.connected = true;

            console.log('✅ Libp2p initialized successfully');
            console.log('📋 New state:', {
                mode: this.state.mode,
                connected: this.state.connected,
                peerId: this.state.peerId,
                addresses: this.state.listeningAddresses
            });

            await this.fullRender(this.state);

            if(this.state.mode === 'listener') {
                const relayAddress = await this.getRelayAddresses()
                const peerAddressInput = this.shadowRoot.querySelector('#peer-address-input');
                peerAddressInput.value = relayAddress
            } else {
                const peerAddressInput = this.shadowRoot.querySelector('#peer-address-input');
                peerAddressInput.value = ''
            }

            return libp2p;
        } catch (error) {
            console.error('❌ Libp2p initialization failed:', error);
            await this.hideSkeleton();

            // Добавляем пользовательское уведомление об ошибке
            this.addError({
                componentName: this.constructor.name,
                source: 'initializeLibp2p',
                message: `Не удалось инициализировать режим ${mode}`,
                details: error
            });
            throw error;
        }
    }

    async connectToPeer(multiaddr) {
        try {
            await this._actions.connectToPeer(multiaddr);
            await this.updatePeerList();
        } catch (error) {
            console.error('Ошибка подключения к пиру:', error);
            throw error;
        }
    }

    async updatePeerList() {
        if (this._actions.getConnectedPeers) {
            this.state.connectedPeers = await this._actions.getConnectedPeers();

            // Проверяем существование элемента перед renderPart
            const peersElement = this.shadowRoot.querySelector('#connected-peers-list');
            if (peersElement && this.renderPart) {
                await this.renderPart({
                    partName: 'renderPeersList',
                    state: this.state,
                    selector: '#connected-peers-list'
                });
            } else {
                console.log('⚠️ updatePeerList: элемент #connected-peers-list не найден, используем полный рендер');
                await this.fullRender(this.state);
            }
        }
    }

    async switchMode(mode) {
        console.log('🔧 switchMode called with:', mode);
        console.log('🔧 Current mode:', this.state.mode);

        if (this.state.mode !== mode) {
            console.log('🔧 Mode change detected, proceeding...');

            if (this._actions && this._actions.cleanup) {
                console.log('🔧 Cleaning up previous connections...');
                await this._actions.cleanup();
            }

            console.log('🔧 Initializing Libp2p with new mode...');
            await this.initializeLibp2p(mode);

            console.log('🔧 Mode switch completed');
        } else {
            console.log('🔧 Mode is already', mode);
        }
    }

    async getRelayAddresses() {
        return '/dns4/localhost/tcp/6835/ws/p2p/12D3KooWBHSGgQQNinaUn9mtx7iqfQSM3sb1Fr1aCnkqLnyeT88i'
        // return this.state.listeningAddresses.filter(addr =>
        //     addr.includes('/p2p-circuit') || addr.includes('/webrtc')
        // );
    }

    // Методы для отладки
    async manualUpdate() {
        console.log('🔄 Ручное обновление PeerConnection');
        if (this._actions && this._actions.manualUpdate) {
            await this._actions.manualUpdate();
        }
    }

    async forceUpdate() {
        console.log('💥 Принудительное обновление PeerConnection');
        if (this._actions && this._actions.forceUpdate) {
            await this._actions.forceUpdate();
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

if (!customElements.get('peer-connection')) {
    customElements.define('peer-connection', PeerConnection);
}
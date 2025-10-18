import { BaseComponent } from '../../base/base-component.mjs';
import * as template from './template/index.mjs';
import { controller } from './controller/index.mjs';
import { createActions } from './actions/index.mjs';

export class PeerConnection extends BaseComponent {
    constructor() {
        super();
        this._templateMethods = template;
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
        this._controller = await controller(this);
        this._actions = await createActions(this);
        // await this._controller.init();
        return true;
    }

    async initializeLibp2p(mode = 'listener') {
        this.state.mode = mode;
        this.state.connected = false;

        await this.showSkeleton({
            selector: '#connection-status',
            replace: true
        });

        try {
            const libp2p = await this._actions.initializeLibp2p(mode);
            this.state.peerId = libp2p.peerId.toString();
            this.state.listeningAddresses = libp2p.getMultiaddrs().map(ma => ma.toString());
            this.state.connected = true;

            await this.fullRender(this.state);
            return libp2p;
        } catch (error) {
            console.error('Ошибка инициализации Libp2p:', error);
            await this.hideSkeleton();
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
            await this.renderPart({
                partName: 'renderConnectedPeers',
                state: this.state,
                selector: '#connected-peers-list'
            });
        }
    }

    async switchMode(mode) {
        if (this.state.mode !== mode) {
            if (this._actions.cleanup) {
                await this._actions.cleanup();
            }
            await this.initializeLibp2p(mode);
        }
    }

    async getRelayAddresses() {
        return this.state.listeningAddresses.filter(addr =>
            addr.includes('/p2p-circuit') || addr.includes('/webrtc')
        );
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
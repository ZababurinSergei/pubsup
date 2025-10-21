import { BaseComponent } from '../../base/base-component.mjs';
import * as template from './template/index.mjs';
import { controller } from './controller/index.mjs';
import { createActions } from './actions/index.mjs';

export class PeerConnection extends BaseComponent {
    constructor() {
        super();
        this._templateMethods = template;
        this.node = null;
        this.state = {
            mode: 'listener',
            connected: false,
            peerId: null,
            listeningAddresses: [],
            connectedPeers: [],
            relayEnabled: true
        };
        this._lastPeersCount = 0; // Для отслеживания изменений
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
            this.node = libp2p; // Сохраняем ноду
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
                const relayAddress = await this.getRelayAddresses();
                const peerAddressInput = this.shadowRoot.querySelector('#peer-address-input');
                peerAddressInput.value = relayAddress;
            } else {
                const peerAddressInput = this.shadowRoot.querySelector('#peer-address-input');
                peerAddressInput.value = '';
            }

            return libp2p;
        } catch (error) {
            console.error('❌ Libp2p initialization failed:', error);
            await this.hideSkeleton();

            this.addError({
                componentName: this.constructor.name,
                source: 'initializeLibp2p',
                message: `Не удалось инициализировать режим ${mode}`,
                details: error
            });
            throw error;
        }
    }

    // Новый метод для получения ноды
    getNode() {
        return this.node;
    }

    // Новый метод для проверки доступности ноды
    isNodeReady() {
        return this.node !== null && this.state.connected;
    }

    /**
     * Копирует текст в буфер обмена с визуальной обратной связью
     * @param {string} text - Текст для копирования
     * @param {string} successMessage - Сообщение об успехе
     */
    async copyToClipboard(text, successMessage = 'Текст скопирован в буфер обмена') {
        try {
            await navigator.clipboard.writeText(text);
            console.log('✅ Text copied to clipboard:', text);

            // Показываем уведомление об успехе
            await this.showModal({
                title: 'Успех',
                content: `<p>${successMessage}</p>`,
                buttons: [{ text: 'OK', type: 'primary' }],
                closeOnBackdropClick: true
            });

            return true;
        } catch (error) {
            console.error('❌ Error copying to clipboard:', error);

            // Fallback для старых браузеров
            try {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);

                if (successful) {
                    await this.showModal({
                        title: 'Успех',
                        content: `<p>${successMessage}</p>`,
                        buttons: [{ text: 'OK', type: 'primary' }],
                        closeOnBackdropClick: true
                    });
                    return true;
                }
            } catch (fallbackError) {
                console.error('❌ Fallback copy also failed:', fallbackError);
            }

            await this.showModal({
                title: 'Ошибка',
                content: '<p>Не удалось скопировать текст в буфер обмена</p>',
                buttons: [{ text: 'OK', type: 'primary' }],
                closeOnBackdropClick: true
            });

            return false;
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
            const previousCount = this._lastPeersCount;
            this.state.connectedPeers = await this._actions.getConnectedPeers();
            this._lastPeersCount = this.state.connectedPeers.length;

            console.log('👥 Peer list updated:', {
                previous: previousCount,
                current: this._lastPeersCount,
                peers: this.state.connectedPeers.map(p => p.id)
            });

            // Обновляем секцию peers-card
            await this.updatePeersCard();

            // Также обновляем детализированную секцию если она существует
            const detailedSection = this.shadowRoot.querySelector('.connected-peers-section');
            if (detailedSection && this.renderPart) {
                await this.renderPart({
                    partName: 'renderConnectedPeersDetailed',
                    state: this.state,
                    selector: '.connected-peers-section .card-content'
                });
            }
        }
    }

    /**
     * Обновляет секцию с пирами
     */
    async updatePeersCard() {
        const peersCard = this.shadowRoot.querySelector('.peers-card');
        if (peersCard && this.renderPart) {
            console.log('🔄 Updating peers card section');
            await this.renderPart({
                partName: 'renderPeersList',
                state: this.state,
                selector: '.peers-card .card-content'
            });

            // После обновления переустанавливаем обработчики
            setTimeout(() => {
                this._setupCopyHandlers();
            }, 100);
        } else {
            console.log('⚠️ Peers card not found, using full render');
            await this.fullRender(this.state);
        }
    }

    /**
     * Устанавливает обработчики для кнопок копирования
     */
    _setupCopyHandlers() {
        const copyButtons = this.shadowRoot.querySelectorAll('.address-action.copy');
        copyButtons.forEach(button => {
            const handler = async (e) => {
                const addressItem = e.target.closest('.address-item');
                if (addressItem) {
                    const address = addressItem.getAttribute('data-address');
                    if (address) {
                        await this.copyToClipboard(address, 'Адрес скопирован в буфер обмена');
                    }
                }
            };
            // Удаляем старые обработчики и добавляем новые
            button.replaceWith(button.cloneNode(true));
            button.addEventListener('click', handler);
        });

        // Также обновляем обработчики для кнопок пиров
        const peerCopyButtons = this.shadowRoot.querySelectorAll('.copy-peer-id');
        peerCopyButtons.forEach(button => {
            const handler = async (e) => {
                const peerId = e.target.getAttribute('data-peer-id');
                if (peerId) {
                    await this.copyToClipboard(peerId, 'Peer ID скопирован в буфер обмена');
                }
            };
            button.replaceWith(button.cloneNode(true));
            button.addEventListener('click', handler);
        });
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
        return '/dns4/localhost/tcp/6835/ws/p2p/12D3KooWBHSGgQQNinaUn9mtx7iqfQSM3sb1Fr1aCnkqLnyeT88i';
    }

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
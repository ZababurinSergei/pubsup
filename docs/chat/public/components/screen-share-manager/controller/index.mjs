// /10/public/components/screen-share-manager/controller/index.mjs
import { logger } from '@libp2p/logger';

export const controller = async (context) => {
    const log = logger('screen-share-manager:controller');
    const eventListeners = [];

    // Обработчик кликов по кнопкам трансляции
    const handleClick = (e) => {
        if (e.target.classList.contains('btn-share')) {
            const peerId = e.target.dataset.peerId;
            if (peerId) {
                context.startScreenShare(peerId);
            }
        }
    };

    // Подписка на обновления списка пиров от peer-connection
    const subscribeToPeerUpdates = async () => {
        const peerConnection = await context.getComponentAsync('peer-connection', 'peer-connection');
        if (!peerConnection) {
            log.warn('peer-connection не найден для подписки на обновления пиров');
            return;
        }

        // Предполагается, что peer-connection отправляет сообщения через postMessage
        // или вызывает напрямую updatePeers — здесь реализуем через событие
        const handlePeerUpdate = (event) => {
            if (event.detail?.type === 'PEERS_UPDATE') {
                context.updatePeers(event.detail.peers || []);
            }
        };

        window.addEventListener('peer-update', handlePeerUpdate);
        eventListeners.push({
            element: window,
            handler: handlePeerUpdate,
            type: 'peer-update'
        });
    };

    return {
        async init() {
            context.shadowRoot.addEventListener('click', handleClick);
            eventListeners.push({
                element: context.shadowRoot,
                handler: handleClick
            });

            await subscribeToPeerUpdates();
            log('контроллер инициализирован');
        },

        async destroy() {
            for (const { element, handler, type } of eventListeners) {
                if (type) {
                    element.removeEventListener(type, handler);
                } else {
                    element.removeEventListener('click', handler);
                }
            }
            eventListeners.length = 0;
            log('контроллер уничтожен');
        }
    };
};
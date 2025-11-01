// /10/public/components/screen-share-manager/actions/index.mjs
import { logger } from '@libp2p/logger';

/**
 * Фабричная функция для создания действий компонента ScreenShareManager
 * @param {Object} context - Контекст (экземпляр компонента)
 * @returns {Promise<Object>} Объект с методами действий
 */
export async function createActions(context) {
    const log = logger('screen-share-manager:actions');

    return {
        /**
         * Инициирует WebRTC-соединение для трансляции экрана
         * @async
         * @param {string} targetPeerId - ID пира-получателя
         * @returns {Promise<void>}
         */
        async startScreenShare(targetPeerId) {
            if (!context || typeof context.startScreenShare !== 'function') {
                log.error('Контекст не поддерживает метод startScreenShare');
                return;
            }
            await context.startScreenShare(targetPeerId);
        },

        /**
         * Обрабатывает входящее сообщение, связанное с демонстрацией экрана
         * @async
         * @param {Object} messageData - Данные сообщения (offer, answer, ice-candidate)
         * @param {string} fromPeerId - ID отправителя
         * @returns {Promise<void>}
         */
        async handleIncomingMessage(messageData, fromPeerId) {
            if (!context || typeof context.handleIncomingMessage !== 'function') {
                log.error('Контекст не поддерживает метод handleIncomingMessage');
                return;
            }
            await context.handleIncomingMessage(messageData, fromPeerId);
        }
    };
}
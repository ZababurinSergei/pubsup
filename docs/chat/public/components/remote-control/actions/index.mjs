// /10/public/components/remote-control/actions/index.mjs
import { logger } from '@libp2p/logger';

const log = logger('remote-control:actions');

/**
 * Фабричная функция для создания действий компонента RemoteControl
 * @param {Object} context - Контекст компонента (экземпляр RemoteControl)
 * @returns {Object} Объект с методами действий
 */
export async function createActions(context) {
    /**
     * Проверяет, доступен ли Chrome DevTools Protocol (CDP) на текущей машине.
     * В обычном браузере — недоступен. Требуется расширение или внешний CDP-сервер.
     * @returns {boolean}
     */
    function isCdpAvailable() {
        // В веб-приложении CDP недоступен без расширения
        return false;
    }

    /**
     * Отправляет событие ввода (мышь/клавиатура) целевому пиру через приватный стрим.
     * Использует существующее соединение из chat-manager.
     * @param {Object} eventData - Данные события
     * @param {string} eventData.type - Тип события ('mousemove', 'mousedown', 'mouseup', 'keydown', 'keyup')
     * @param {number} [eventData.x] - Координата X (для мыши)
     * @param {number} [eventData.y] - Координата Y (для мыши)
     * @param {string} [eventData.key] - Код клавиши (для клавиатуры)
     * @param {number} [eventData.button] - Кнопка мыши (0 — левая, 1 — средняя, 2 — правая)
     */
    async function sendInputEvent(eventData) {
        if (!context.state.targetPeer) {
            log.warn('Нет целевого пира для отправки события ввода');
            return;
        }

        const chatManager = await context.getComponentAsync('chat-manager', 'chat-manager');
        if (!chatManager) {
            log.error('chat-manager не найден для отправки REMOTE_CONTROL_EVENT');
            return;
        }

        const message = {
            type: 'REMOTE_CONTROL_EVENT',
            payload: {
                ...eventData,
                timestamp: Date.now()
            }
        };

        try {
            await chatManager.sendPrivateMessage(context.state.targetPeer, JSON.stringify(message));
            log('Событие ввода отправлено: %s', eventData.type);
        } catch (error) {
            log.error('Ошибка отправки события ввода: %o', error);
        }
    }

    /**
     * Обрабатывает входящее событие ввода от удалённого пира.
     * Выполняет визуализацию (курсор, клики) и, при наличии CDP — реальные действия.
     * @param {Object} messageData - Данные сообщения из chat-manager
     */
    async function handleInputEvent(messageData) {
        if (!messageData?.payload || context.state.mode !== 'viewer') {
            return;
        }

        const { type, x, y, key, button } = messageData.payload;

        // === Визуализация курсора ===
        if (type === 'mousemove' && typeof x === 'number' && typeof y === 'number') {
            context.state.cursorPosition = { x, y };
            await context.renderPart({
                partName: 'renderCursor',
                state: context.state,
                selector: '#remote-cursor'
            });
        }

        // === Визуализация клика ===
        if (type === 'mousedown' && typeof x === 'number' && typeof y === 'number') {
            await context.renderPart({
                partName: 'renderClickEffect',
                state: { x, y },
                selector: '#remote-screen',
                method: 'append'
            });
        }

        // === Реальное управление через CDP (заглушка) ===
        if (isCdpAvailable()) {
            log('CDP недоступен в текущей среде — пропуск реального ввода');
            // Здесь могла бы быть интеграция с chrome-remote-interface
        }
    }

    /**
     * Подписывается на входящие REMOTE_CONTROL_EVENT через chat-manager.
     * В текущей архитектуре chat-manager должен пересылать такие события.
     */
    async function setupInputListener() {
        // Подписка реализуется через postMessage от chat-manager.
        // Никаких дополнительных действий не требуется — обработка в postMessage компонента.
    }

    /**
     * Очистка ресурсов при отключении компонента.
     */
    async function cleanup() {
        // Нет активных стримов — всё управление через chat-manager
        log('Очистка remote-control завершена');
    }

    async function sendInputToExtension(eventData) {
        const EXTENSION_ID = 'abcdefghijklmnopabcdefhijklmno'; // ← ваш ID

        try {
            const response = await chrome.runtime.sendMessage(EXTENSION_ID, {
                type: 'REMOTE_CONTROL_EVENT',
                payload: eventData
            });
            if (response?.error) {
                console.warn('Ошибка расширения:', response.error);
            }
        } catch (e) {
            console.error('Расширение недоступно:', e);
        }
    }

    return {
        sendInputToExtension,
        sendInputEvent,
        handleInputEvent,
        setupInputListener,
        cleanup
    };
}
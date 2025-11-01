// /10/public/components/remote-control/controller/index.mjs
import { logger } from '@libp2p/logger';

const log = logger('remote-control:controller');

/**
 * Контроллер для компонента RemoteControl
 * @param {RemoteControl} context - Ссылка на экземпляр компонента
 * @returns {Object} Объект с методами init и destroy
 */
export const controller = (context) => {
    let eventListeners = [];

    const add = (el, ev, fn) => {
        el?.addEventListener(ev, fn);
        eventListeners.push({ element: el, event: ev, handler: fn });
    };

    return {
        /**
         * Инициализирует контроллер: навешивает обработчики событий в зависимости от режима
         * @async
         */
        async init() {
            if (context.state.mode === 'controller') {
                const screen = context.shadowRoot.querySelector('#remote-screen');
                if (screen) {
                    add(screen, 'mousemove', (e) => {
                        const rect = screen.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        context._actions.sendInputEvent({
                            type: 'mousemove',
                            x,
                            y
                        });
                    });

                    add(screen, 'mousedown', (e) => {
                        const rect = screen.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        context._actions.sendInputEvent({
                            type: 'mousedown',
                            x,
                            y,
                            button: e.button
                        });
                    });

                    add(screen, 'mouseup', (e) => {
                        const rect = screen.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        context._actions.sendInputEvent({
                            type: 'mouseup',
                            x,
                            y,
                            button: e.button
                        });
                    });

                    add(screen, 'keydown', (e) => {
                        context._actions.sendInputEvent({
                            type: 'keydown',
                            key: e.key,
                            code: e.code,
                            ctrlKey: e.ctrlKey,
                            shiftKey: e.shiftKey,
                            altKey: e.altKey,
                            metaKey: e.metaKey
                        });
                    });

                    screen.setAttribute('tabindex', '0');
                    screen.focus();
                }
            }
        },

        /**
         * Уничтожает контроллер и очищает ресурсы
         * @async
         */
        async destroy() {
            eventListeners.forEach(({ element, event, handler }) => {
                try {
                    element?.removeEventListener(event, handler);
                } catch (error) {
                    log.error('Ошибка при удалении обработчика события: %o', error);
                }
            });
            eventListeners = [];
            log('Контроллер remote-control уничтожен');
        }
    };
};
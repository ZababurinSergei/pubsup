import { logger } from '@libp2p/logger';

/**
 * Контроллер для компонента ChatInterface
 * @param {HTMLElement} context - Ссылка на экземпляр компонента
 * @returns {Object} Объект с методами init и destroy
 */
export const controller = async (context) => {
    const log = logger('chat-interface:controller');
    let eventListeners = [];

    return {
        /**
         * Инициализирует контроллер компонента ChatInterface
         * @async
         */
        async init() {
            log('инициализация контроллера');

            // Обработчик отправки сообщения
            const sendMessageBtn = context.shadowRoot.querySelector('#send-message');
            const messageInput = context.shadowRoot.querySelector('#message-input');

            if (sendMessageBtn && messageInput) {
                const sendMessageHandler = async () => {
                    if (messageInput.value.trim() && context.state.currentGroup) {
                        const chatManager = await context.getComponentAsync('chat-manager', 'chat-manager');
                        if (chatManager) {
                            log('отправка сообщения через контроллер');
                            await chatManager.postMessage({
                                type: 'SEND_MESSAGE',
                                data: {
                                    message: messageInput.value.trim(),
                                    topic: context.state.currentGroup.topic
                                }
                            });
                            messageInput.value = '';
                        }
                    }
                };

                sendMessageBtn.addEventListener('click', sendMessageHandler);
                eventListeners.push({ element: sendMessageBtn, handler: sendMessageHandler });

                // Обработчик отправки по Enter
                const enterHandler = (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessageHandler();
                    }
                };

                messageInput.addEventListener('keypress', enterHandler);
                eventListeners.push({ element: messageInput, handler: enterHandler });
            }

            // Обработчик очистки чата
            const clearChatBtn = context.shadowRoot.querySelector('#clear-chat');
            if (clearChatBtn) {
                const clearChatHandler = async () => {
                    log('очистка чата через контроллер');
                    await context.clearMessages();
                };

                clearChatBtn.addEventListener('click', clearChatHandler);
                eventListeners.push({ element: clearChatBtn, handler: clearChatHandler });
            }

            // Обработчик копирования ID чата
            const copyChatIdBtn = context.shadowRoot.querySelector('#copy-chat-id');
            if (copyChatIdBtn) {
                const copyChatIdHandler = async () => {
                    if (context.state.currentGroup) {
                        try {
                            await navigator.clipboard.writeText(context.state.currentGroup.topic);
                            const originalText = copyChatIdBtn.textContent;
                            copyChatIdBtn.textContent = 'Скопировано!';
                            setTimeout(() => {
                                copyChatIdBtn.textContent = originalText;
                            }, 2000);
                            log('ID чата скопирован: %s', context.state.currentGroup.topic);
                        } catch (err) {
                            log.error('ошибка копирования ID чата: %o', err);
                        }
                    }
                };

                copyChatIdBtn.addEventListener('click', copyChatIdHandler);
                eventListeners.push({ element: copyChatIdBtn, handler: copyChatIdHandler });
            }

            // Обработчик переключения видимости участников
            const toggleMembersBtn = context.shadowRoot.querySelector('#toggle-members');
            if (toggleMembersBtn) {
                const toggleMembersHandler = () => {
                    const membersPanel = context.shadowRoot.querySelector('#members-panel');
                    if (membersPanel) {
                        const isVisible = membersPanel.style.display !== 'none';
                        membersPanel.style.display = isVisible ? 'none' : 'block';
                        toggleMembersBtn.textContent = isVisible ? 'Показать участников' : 'Скрыть участников';
                        log('видимость панели участников изменена: %s', isVisible ? 'скрыта' : 'показана');
                    }
                };

                toggleMembersBtn.addEventListener('click', toggleMembersHandler);
                eventListeners.push({ element: toggleMembersBtn, handler: toggleMembersHandler });
            }

            // Автофокус на поле ввода сообщения
            // if (messageInput) {
            //     setTimeout(() => {
            //         messageInput.focus();
            //     }, 100);
            // }

            log('контроллер инициализирован, обработчиков: %d', eventListeners.length);
        },

        /**
         * Уничтожает контроллер и очищает ресурсы
         * @async
         */
        async destroy() {
            // Очистка всех обработчиков событий
            eventListeners.forEach(({ element, handler }) => {
                element.removeEventListener('click', handler);
                element.removeEventListener('keypress', handler);
            });

            log('контроллер уничтожен, удалено обработчиков: %d', eventListeners.length);
            eventListeners = [];
        }
    };
};
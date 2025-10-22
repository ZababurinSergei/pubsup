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
            log('controller initializing');

            // Обработчик отправки сообщения
            const sendMessageBtn = context.shadowRoot.querySelector('#send-message');
            let messageInput = context.shadowRoot.querySelector('#message-input');

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

            // Обработчики для кнопок присоединения к группам
            const setupGroupActionHandlers = () => {
                // Обработчики для кнопок присоединения к группам
                const joinButtons = context.shadowRoot.querySelectorAll('.join-group-btn');
                joinButtons.forEach(button => {
                    const handler = async (e) => {
                        const groupId = e.target.dataset.groupId || e.target.closest('.join-group-btn')?.dataset.groupId;
                        const groupTopic = e.target.dataset.topic || e.target.closest('.join-group-btn')?.dataset.topic;

                        if (groupId || groupTopic) {
                            const topic = groupTopic || groupId;
                            const group = context.state.discoveredGroups?.find(g => g.id === topic) ||
                                context.state.groups?.find(g => g.id === topic);

                            if (group) {
                                try {
                                    await context.joinGroup(group);
                                    log('Successfully joined group: %s', group.name);
                                } catch (error) {
                                    log.error('Error joining group: %o', error);
                                    await context.showModal({
                                        title: 'Ошибка',
                                        content: `<p>Не удалось присоединиться к группе: ${error.message}</p>`,
                                        buttons: [{ text: 'OK', type: 'primary' }]
                                    });
                                }
                            }
                        }
                    };

                    button.addEventListener('click', handler);
                    eventListeners.push({ element: button, handler: handler });
                });

                // Обработчики для кнопок выхода из групп
                const leaveButtons = context.shadowRoot.querySelectorAll('.leave-group-btn');
                leaveButtons.forEach(button => {
                    const handler = async (e) => {
                        const groupId = e.target.dataset.groupId || e.target.closest('.leave-group-btn')?.dataset.groupId;
                        if (groupId) {
                            try {
                                await context.leaveGroup(groupId);
                                log('Successfully left group: %s', groupId);
                            } catch (error) {
                                log.error('Error leaving group: %o', error);
                                await context.showModal({
                                    title: 'Ошибка',
                                    content: `<p>Не удалось покинуть группу: ${error.message}</p>`,
                                    buttons: [{ text: 'OK', type: 'primary' }]
                                });
                            }
                        }
                    };
                    button.addEventListener('click', handler);
                    eventListeners.push({ element: button, handler: handler });
                });
            };

            // Обработчики кликов на участников для приватного чата
            const setupMemberClickHandlers = () => {
                const memberItems = context.shadowRoot.querySelectorAll('.member-item');

                memberItems.forEach(item => {
                    const handler = async (e) => {
                        // Предотвращаем срабатывание на кнопках действий
                        if (e.target.closest('.member-actions')) {
                            return;
                        }

                        const peerId = e.currentTarget.getAttribute('data-peer-id');
                        const member = context.state.connectedPeers.find(p => p.id === peerId);

                        if (member && !member.isCurrentUser) {
                            try {
                                log('выбор пользователя для приватного чата: %s', member.name || member.id);
                                await context.setActiveMember(member);
                            } catch (error) {
                                log.error('ошибка выбора пользователя: %o', error);
                            }
                        }
                    };

                    item.addEventListener('click', handler);
                    eventListeners.push({ element: item, handler: handler });
                });
            };

            // Наблюдатель за изменениями DOM для динамических кнопок
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        console.log('-----------------------------------', mutation)
                        setupGroupActionHandlers();
                        setupMemberClickHandlers();
                    }
                });
            });

            // Начинаем наблюдение за изменениями в shadowRoot
            observer.observe(context.shadowRoot, {
                childList: true,
                subtree: true
            });

            // Сохраняем observer для очистки
            context._groupObserver = observer;

            // Инициализация обработчиков при первом рендере
            // setTimeout(() => {
                setupGroupActionHandlers();
                setupMemberClickHandlers();
            // }, 100);

            // Обработчик для кнопки отправки сообщения #send-button
            const setupSendButtonHandler = () => {
                const sendButton = context.shadowRoot.querySelector('#send-button');
                const messageInput = context.shadowRoot.querySelector('#message-input');
                if (sendButton && messageInput) {
                    const sendHandler = async () => {
                        const message = messageInput.value.trim();
                        if (message && context.state.connected) {
                            try {
                                if (context.state.isPrivateChat && context.state.activeMember) {
                                    // Отправка приватного сообщения
                                    await context._actions.sendPrivateMessage(
                                        message,
                                        context.state.activeMember.id
                                    );
                                } else if (context.state.currentGroup) {
                                    // Отправка в группу
                                    await context._actions.sendMessage(
                                        message,
                                        context.state.currentGroup.topic
                                    );
                                }

                                // Очистка поля ввода после отправки
                                messageInput.value = '';

                            } catch (error) {
                                log.error('Ошибка отправки сообщения: %o', error);
                                await context.showModal({
                                    title: 'Ошибка отправки',
                                    content: `<p>Не удалось отправить сообщение: ${error.message}</p>`,
                                    buttons: [{ text: 'OK', type: 'primary' }]
                                });
                            }
                        }
                    };

                    // Обработчик клика по кнопке
                    sendButton.addEventListener('click', sendHandler);
                    eventListeners.push({ element: sendButton, handler: sendHandler });

                    // Обработчик Enter в поле ввода
                    const enterHandler = (e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendHandler();
                        }
                    };

                    messageInput.addEventListener('keypress', enterHandler);
                    eventListeners.push({ element: messageInput, handler: enterHandler });

                    log('Обработчики для кнопки отправки установлены');
                } else {
                    log('Элементы #send-button или #message-input не найдены');
                }
            };

            // Инициализация обработчика кнопки отправки
            // setTimeout(() => {
                setupSendButtonHandler();
            // }, 100);

            // Автофокус на поле ввода сообщения
            // if (messageInput) {
            //     setTimeout(() => {
            //         messageInput.focus();
            //     }, 100);
            // }

            log('контроллер инициализирован');
            log('Total event listeners: %d', eventListeners.length);

            // Отладочная информация о найденных элементах
            const memberItems = context.shadowRoot.querySelectorAll('.member-item');
            log('найдено элементов .member-item: %d', memberItems.length);

            messageInput = context.shadowRoot.querySelector('#message-input');
            log('поле ввода сообщения найдено: %s', !!messageInput);

            const sendButton = context.shadowRoot.querySelector('#send-button');
            log('кнопка отправки #send-button найдена: %s', !!sendButton);
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
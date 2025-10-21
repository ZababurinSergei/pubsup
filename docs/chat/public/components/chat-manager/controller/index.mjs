/**
 * Контроллер для компонента ChatManager
 * @param {HTMLElement} context - Ссылка на экземпляр компонента
 * @returns {Object} Объект с методами init и destroy
 */
export const controller = async (context) => {
    let eventListeners = [];

    return {
        /**
         * Инициализирует контроллер компонента ChatManager
         * @async
         */
        async init() {
            // Обработчики для переключения режимов
            const listenerBtn = context.shadowRoot.querySelector('#listener-mode');
            const dialerBtn = context.shadowRoot.querySelector('#dialer-mode');

            if (listenerBtn) {
                const listenerHandler = () => context.switchMode('listener');
                listenerBtn.addEventListener('click', listenerHandler);
                eventListeners.push({ element: listenerBtn, handler: listenerHandler });
            }

            if (dialerBtn) {
                const dialerHandler = () => context.switchMode('dialer');
                dialerBtn.addEventListener('click', dialerHandler);
                eventListeners.push({ element: dialerBtn, handler: dialerHandler });
            }

            // Обработчик создания группы
            const createGroupBtn = context.shadowRoot.querySelector('#create-group');
            if (createGroupBtn) {
                const createGroupHandler = async () => {
                    const groupNameInput = context.shadowRoot.querySelector('#group-name');
                    if (groupNameInput && groupNameInput.value.trim()) {
                        await context.createGroup(groupNameInput.value.trim());
                        groupNameInput.value = '';
                    }
                };
                createGroupBtn.addEventListener('click', createGroupHandler);
                eventListeners.push({ element: createGroupBtn, handler: createGroupHandler });
            }

            // Обработчик поиска групп
            const searchInput = context.shadowRoot.querySelector('#group-search');
            if (searchInput) {
                const searchHandler = (e) => {
                    context.searchGroups(e.target.value);
                };
                searchInput.addEventListener('input', searchHandler);
                eventListeners.push({ element: searchInput, handler: searchHandler });
            }

            // Обработчик отправки сообщения
            const sendMessageBtn = context.shadowRoot.querySelector('#send-message');
            const messageInput = context.shadowRoot.querySelector('#message-input');

            if (sendMessageBtn && messageInput) {
                const sendMessageHandler = async () => {
                    if (messageInput.value.trim() && context.state.currentGroup) {
                        await context._actions.sendMessage(context.state.currentGroup.topic, messageInput.value.trim());
                        messageInput.value = '';
                    }
                };

                sendMessageBtn.addEventListener('click', sendMessageHandler);
                eventListeners.push({ element: sendMessageBtn, handler: sendMessageHandler });

                // Отправка по Enter
                const enterHandler = (e) => {
                    if (e.key === 'Enter') {
                        sendMessageHandler();
                    }
                };
                messageInput.addEventListener('keypress', enterHandler);
                eventListeners.push({ element: messageInput, handler: enterHandler });
            }

            // Обработчики для присоединения к группам
            const joinGroupHandler = async (event) => {
                const groupElement = event.target.closest('[data-group-topic]');
                if (groupElement) {
                    const topic = groupElement.getAttribute('data-group-topic');
                    await context.joinGroup(topic);
                }
            };

            const groupsContainer = context.shadowRoot.querySelector('#groups-container');
            if (groupsContainer) {
                groupsContainer.addEventListener('click', joinGroupHandler);
                eventListeners.push({ element: groupsContainer, handler: joinGroupHandler });
            }

            // Обработчик очистки сообщений
            const clearMessagesBtn = context.shadowRoot.querySelector('#clear-messages');
            if (clearMessagesBtn) {
                const clearHandler = async () => {
                    context.state.messages = [];
                    await context.renderPart({
                        partName: 'renderMessages',
                        state: context.state,
                        selector: '#messages-container'
                    });
                };
                clearMessagesBtn.addEventListener('click', clearHandler);
                eventListeners.push({ element: clearMessagesBtn, handler: clearHandler });
            }

            // Обработчик обнаружения групп
            const discoverGroupsBtn = context.shadowRoot.querySelector('#discover-groups');
            if (discoverGroupsBtn) {
                const discoverHandler = async () => {
                    await context._actions.discoverGroups();
                };
                discoverGroupsBtn.addEventListener('click', discoverHandler);
                eventListeners.push({ element: discoverGroupsBtn, handler: discoverHandler });
            }

            // Обработчики для переключения между группами
            const setupGroupHandlers = () => {
                const groupItems = context.shadowRoot.querySelectorAll('.group-item');
                groupItems.forEach(item => {
                    const handler = async (e) => {
                        // Предотвращаем срабатывание на кнопках действий
                        if (e.target.closest('.group-actions')) {
                            return;
                        }

                        const groupId = e.currentTarget.getAttribute('data-group-id');
                        const groupTopic = e.currentTarget.getAttribute('data-group-topic');

                        if (groupId || groupTopic) {
                            const topic = groupTopic || groupId;
                            const group = context.state.groups.find(g => g.id === topic || g.topic === topic);
                            if (group) {
                                try {
                                    await context.joinGroup(group);
                                    console.log('✅ Switched to group:', group.name);
                                } catch (error) {
                                    console.error('❌ Error switching group:', error);
                                    context.addError({
                                        componentName: context.constructor.name,
                                        source: 'group-switch',
                                        message: 'Ошибка переключения группы',
                                        details: error
                                    });
                                }
                            }
                        }
                    };

                    item.addEventListener('click', handler);
                    eventListeners.push({ element: item, handler: handler });
                });
            };

            // Обработчики для кнопок действий в группах
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
                                    console.log('✅ Successfully joined group:', group.name);
                                } catch (error) {
                                    console.error('❌ Error joining group:', error);
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
                                console.log('✅ Successfully left group:', groupId);
                            } catch (error) {
                                console.error('❌ Error leaving group:', error);
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

            // Наблюдатель за изменениями DOM для динамических кнопок
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        setupGroupHandlers();
                        setupGroupActionHandlers();
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
            setTimeout(() => {
                setupGroupHandlers();
                setupGroupActionHandlers();
            }, 100);

            // Автофокус на поле ввода сообщения
            if (messageInput) {
                setTimeout(() => {
                    messageInput.focus();
                }, 100);
            }

            console.log('[ChatManager] Контроллер инициализирован');
        },

        /**
         * Уничтожает контроллер и очищает ресурсы
         * @async
         */
        async destroy() {
            // Очистка всех обработчиков событий
            eventListeners.forEach(({ element, handler }) => {
                element.removeEventListener('click', handler);
                element.removeEventListener('input', handler);
                element.removeEventListener('keypress', handler);
            });
            eventListeners = [];

            // Остановка наблюдателя за DOM
            if (context._groupObserver) {
                context._groupObserver.disconnect();
                context._groupObserver = null;
            }

            console.log('[ChatManager] Контроллер уничтожен');
        }
    };
};
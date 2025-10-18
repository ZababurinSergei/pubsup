/**
 * Контроллер для компонента GroupManager
 * @param {HTMLElement} context - Ссылка на экземпляр компонента
 * @returns {Object} Объект с методами init и destroy
 */
export const controller = async (context) => {
    let eventListeners = [];

    return {
        /**
         * Инициализирует контроллер компонента GroupManager
         * @async
         */
        async init() {
            // Обработчик создания новой группы
            const createGroupBtn = context.shadowRoot.querySelector('#create-group-btn');
            if (createGroupBtn) {
                const createGroupHandler = async () => {
                    const groupNameInput = context.shadowRoot.querySelector('#group-name-input');
                    if (groupNameInput && groupNameInput.value.trim()) {
                        await context.createGroup(groupNameInput.value.trim());
                        groupNameInput.value = '';
                    }
                };
                createGroupBtn.addEventListener('click', createGroupHandler);
                eventListeners.push({ element: createGroupBtn, handler: createGroupHandler });
            }

            // Обработчик поиска групп
            const searchInput = context.shadowRoot.querySelector('#group-search-input');
            if (searchInput) {
                const searchHandler = (e) => {
                    context.searchGroups(e.target.value);
                };
                searchInput.addEventListener('input', searchHandler);
                eventListeners.push({ element: searchInput, handler: searchHandler });
            }

            // Обработчик обнаружения групп
            const discoverBtn = context.shadowRoot.querySelector('#discover-groups-btn');
            if (discoverBtn) {
                const discoverHandler = async () => {
                    await context.discoverGroups();
                };
                discoverBtn.addEventListener('click', discoverHandler);
                eventListeners.push({ element: discoverBtn, handler: discoverHandler });
            }

            // Обработчики для кнопок присоединения к группам
            const setupJoinButtons = () => {
                const joinButtons = context.shadowRoot.querySelectorAll('.join-group-btn');
                joinButtons.forEach(button => {
                    const handler = async (e) => {
                        const groupId = e.target.dataset.groupId;
                        const group = context.state.discoveredGroups.find(g => g.id === groupId) ||
                            context.state.groups.find(g => g.id === groupId);
                        if (group) {
                            await context.joinGroup(group);

                            // Уведомляем chat-manager о присоединении к группе
                            const chatManager = await context.getComponentAsync('chat-manager', 'chat-manager');
                            if (chatManager) {
                                await chatManager.postMessage({
                                    type: 'JOIN_GROUP',
                                    data: group
                                });
                            }
                        }
                    };
                    button.addEventListener('click', handler);
                    eventListeners.push({ element: button, handler: handler });
                });
            };

            // Обработчики для кнопок выхода из групп
            const setupLeaveButtons = () => {
                const leaveButtons = context.shadowRoot.querySelectorAll('.leave-group-btn');
                leaveButtons.forEach(button => {
                    const handler = async (e) => {
                        const groupId = e.target.dataset.groupId;
                        await context.leaveGroup(groupId);
                    };
                    button.addEventListener('click', handler);
                    eventListeners.push({ element: button, handler: handler });
                });
            };

            // Наблюдатель за изменениями DOM для динамических кнопок
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        setupJoinButtons();
                        setupLeaveButtons();
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

            // Инициализация кнопок при первом рендере
            setTimeout(() => {
                setupJoinButtons();
                setupLeaveButtons();
            }, 100);
        },

        /**
         * Уничтожает контроллер и очищает ресурсы
         * @async
         */
        async destroy() {
            // Очистка всех обработчиков событий
            eventListeners.forEach(({ element, handler }) => {
                element.removeEventListener('click', handler);
            });
            eventListeners = [];

            // Остановка наблюдателя за DOM
            if (context._groupObserver) {
                context._groupObserver.disconnect();
                context._groupObserver = null;
            }
        }
    };
};
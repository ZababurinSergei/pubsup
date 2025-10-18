/**
 * Контроллер для компонента ChatManager
 * @param {HTMLElement} context - Ссылка на экземпляр компонента
 * @returns {Object} Объект с методами init и destroy
 */
export const controller = async (context) => {
    let eventListeners = [];

    return {
        /**
         * Инициализирует контроллер компонента
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

            console.log('[ChatManager] Контроллер уничтожен');
        }
    };
};
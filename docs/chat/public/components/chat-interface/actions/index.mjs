/**
 * Фабричная функция для создания действий компонента ChatInterface
 * @param {Object} context - Контекст компонента
 * @returns {Promise<Object>} Объект с методами действий
 */
export async function createActions(context) {
    return {
        /**
         * Отправка сообщения в чат
         * @async
         * @param {string} message - Текст сообщения
         * @param {string} topic - Топик/группа для отправки
         */
        sendMessage: sendMessage.bind(context),

        /**
         * Обработка входящего сообщения
         * @async
         * @param {Object} messageData - Данные сообщения
         */
        handleIncomingMessage: handleIncomingMessage.bind(context),

        /**
         * Очистка истории сообщений
         * @async
         */
        clearChatHistory: clearChatHistory.bind(context),

        /**
         * Установка текущей группы/топика
         * @async
         * @param {Object} group - Данные группы
         */
        setActiveGroup: setActiveGroup.bind(context),

        /**
         * Поиск по сообщениям
         * @async
         * @param {string} query - Поисковый запрос
         */
        searchMessages: searchMessages.bind(context)
    };
}

/**
 * Логика отправки сообщения
 * @async
 * @param {string} message - Текст сообщения
 * @param {string} topic - Топик/группа для отправки
 * @this {HTMLElement} Контекст компонента
 */
async function sendMessage(message, topic) {
    try {
        if (!message.trim()) {
            await this.showModal({
                title: 'Ошибка',
                content: '<p>Сообщение не может быть пустым</p>',
                buttons: [{ text: 'OK', type: 'primary' }]
            });
            return;
        }

        if (!topic) {
            await this.showModal({
                title: 'Ошибка',
                content: '<p>Не выбрана группа для отправки</p>',
                buttons: [{ text: 'OK', type: 'primary' }]
            });
            return;
        }

        // Получаем менеджер чата для отправки сообщения
        const chatManager = await this.getComponentAsync('chat-manager', 'chat-manager');
        if (chatManager && chatManager._actions) {
            await chatManager._actions.sendMessage(topic, message);

            // Очищаем поле ввода после отправки
            const messageInput = this.shadowRoot.querySelector('#message-input');
            if (messageInput) {
                messageInput.value = '';
            }
        } else {
            throw new Error('Чат менеджер не доступен');
        }
    } catch (error) {
        console.error('Ошибка отправки сообщения:', error);
        this.addError({
            componentName: this.constructor.name,
            source: 'sendMessage',
            message: 'Ошибка отправки сообщения',
            details: error
        });

        await this.showModal({
            title: 'Ошибка отправки',
            content: `<p>Не удалось отправить сообщение: ${error.message}</p>`,
            buttons: [{ text: 'OK', type: 'primary' }]
        });
    }
}

/**
 * Логика обработки входящего сообщения
 * @async
 * @param {Object} messageData - Данные сообщения
 * @param {string} messageData.text - Текст сообщения
 * @param {string} messageData.topic - Топик сообщения
 * @param {string} messageData.from - ID отправителя
 * @param {string} messageData.type - Тип сообщения ('received' | 'sent')
 * @param {number} messageData.timestamp - Временная метка
 * @this {HTMLElement} Контекст компонента
 */
async function handleIncomingMessage(messageData) {
    try {
        // Проверяем, относится ли сообщение к текущей группе
        if (this.state.currentGroup && messageData.topic === this.state.currentGroup.topic) {
            await this.addMessage({
                text: messageData.text,
                from: messageData.from,
                type: messageData.type || 'received',
                timestamp: messageData.timestamp || Date.now(),
                topic: messageData.topic
            });

            // Показываем уведомление, если окно не активно
            if (document.hidden) {
                this.showNotification(`Новое сообщение в ${this.state.currentGroup.name}`);
            }
        } else if (!this.state.currentGroup && messageData.type === 'received') {
            // Сообщение из группы, к которой не подключены в данный момент
            console.log(`Сообщение из группы ${messageData.topic}: ${messageData.text}`);
        }
    } catch (error) {
        console.error('Ошибка обработки входящего сообщения:', error);
        this.addError({
            componentName: this.constructor.name,
            source: 'handleIncomingMessage',
            message: 'Ошибка обработки входящего сообщения',
            details: { messageData, error }
        });
    }
}

/**
 * Логика очистки истории сообщений
 * @async
 * @this {HTMLElement} Контекст компонента
 */
async function clearChatHistory() {
    try {
        await this.showModal({
            title: 'Подтверждение',
            content: '<p>Вы уверены, что хотите очистить историю сообщений?</p>',
            buttons: [
                {
                    text: 'Отмена',
                    type: 'secondary',
                    action: () => console.log('Очистка отменена')
                },
                {
                    text: 'Очистить',
                    type: 'primary',
                    action: async () => {
                        await this.clearMessages();
                        console.log('История сообщений очищена');
                    }
                }
            ]
        });
    } catch (error) {
        console.error('Ошибка очистки истории:', error);
        this.addError({
            componentName: this.constructor.name,
            source: 'clearChatHistory',
            message: 'Ошибка очистки истории сообщений',
            details: error
        });
    }
}

/**
 * Логика установки активной группы
 * @async
 * @param {Object} group - Данные группы
 * @param {string} group.id - ID группы
 * @param {string} group.name - Название группы
 * @param {string} group.topic - Топик группы
 * @param {Array} group.peers - Список участников
 * @this {HTMLElement} Контекст компонента
 */
async function setActiveGroup(group) {
    try {
        if (!group || !group.topic) {
            throw new Error('Неверные данные группы');
        }

        // Показываем индикатор загрузки
        await this.showSkeleton({
            selector: '#messages-list',
            replace: true
        });

        // Устанавливаем новую группу
        await this.setCurrentGroup(group);

        // Обновляем статус подключения
        await this.updateConnectionStatus(true);

        // Скрываем индикатор загрузки
        await this.hideSkeleton();

        // Логируем переключение группы
        console.log(`Переключились на группу: ${group.name} (${group.topic})`);

    } catch (error) {
        console.error('Ошибка установки активной группы:', error);
        await this.hideSkeleton();

        this.addError({
            componentName: this.constructor.name,
            source: 'setActiveGroup',
            message: 'Ошибка установки активной группы',
            details: { group, error }
        });

        await this.showModal({
            title: 'Ошибка',
            content: `<p>Не удалось переключиться на группу: ${error.message}</p>`,
            buttons: [{ text: 'OK', type: 'primary' }]
        });
    }
}

/**
 * Логика поиска по сообщениям
 * @async
 * @param {string} query - Поисковый запрос
 * @this {HTMLElement} Контекст компонента
 */
async function searchMessages(query) {
    try {
        if (!query.trim()) {
            // Если запрос пустой, показываем все сообщения
            await this.renderPart({
                partName: 'renderMessages',
                state: this.state,
                selector: '#messages-list'
            });
            return;
        }

        // Фильтруем сообщения по запросу
        const filteredMessages = this.state.messages.filter(message =>
            message.text.toLowerCase().includes(query.toLowerCase()) ||
            message.from.toLowerCase().includes(query.toLowerCase())
        );

        // Временно сохраняем оригинальные сообщения
        const originalMessages = [...this.state.messages];

        // Устанавливаем отфильтрованные сообщения
        this.state.messages = filteredMessages;

        // Рендерим отфильтрованный список
        await this.renderPart({
            partName: 'renderMessages',
            state: this.state,
            selector: '#messages-list'
        });

        // Восстанавливаем оригинальные сообщения
        this.state.messages = originalMessages;

        // Показываем количество найденных результатов
        const resultsCount = filteredMessages.length;
        await this.showModal({
            title: 'Результаты поиска',
            content: `<p>Найдено сообщений: ${resultsCount}</p>`,
            buttons: [{ text: 'OK', type: 'primary' }],
            closeOnBackdropClick: true
        });

    } catch (error) {
        console.error('Ошибка поиска сообщений:', error);
        this.addError({
            componentName: this.constructor.name,
            source: 'searchMessages',
            message: 'Ошибка поиска по сообщениям',
            details: { query, error }
        });
    }
}

/**
 * Показывает браузерное уведомление
 * @param {string} message - Текст уведомления
 * @this {HTMLElement} Контекст компонента
 */
function showNotification(message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('P2P Чат', {
            body: message,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('P2P Чат', {
                    body: message,
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
                });
            }
        });
    }
}
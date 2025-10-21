import { logger } from '@libp2p/logger';

/**
 * Фабричная функция для создания действий компонента ChatInterface
 * @param {Object} context - Контекст компонента
 * @returns {Promise<Object>} Объект с методами действий
 */
export async function createActions(context) {
    const log = logger('chat-interface:actions');

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
    const log = logger('chat-interface:actions:sendMessage');

    try {
        if (!message.trim()) {
            log.error('попытка отправки пустого сообщения');
            await this.showModal({
                title: 'Ошибка',
                content: '<p>Сообщение не может быть пустым</p>',
                buttons: [{ text: 'OK', type: 'primary' }]
            });
            return;
        }

        if (!topic) {
            log.error('не выбрана группа для отправки');
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
            log('отправка сообщения в группу: %s', topic);
            await chatManager._actions.sendMessage(topic, message);

            // Очищаем поле ввода после отправки
            const messageInput = this.shadowRoot.querySelector('#message-input');
            if (messageInput) {
                messageInput.value = '';
            }

            log('сообщение отправлено успешно');
        } else {
            log.error('чат менеджер не доступен');
            throw new Error('Чат менеджер не доступен');
        }
    } catch (error) {
        log.error('ошибка отправки сообщения: %o', error);
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
    const log = logger('chat-interface:actions:handleIncomingMessage');

    try {
        // Проверяем, относится ли сообщение к текущей группе
        if (this.state.currentGroup && messageData.topic === this.state.currentGroup.topic) {
            log('обработка входящего сообщения для текущей группы: %s', messageData.topic);
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
            log('сообщение из неактивной группы %s: %s', messageData.topic, messageData.text);
        }
    } catch (error) {
        log.error('ошибка обработки входящего сообщения: %o', error);
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
    const log = logger('chat-interface:actions:clearChatHistory');

    try {
        log('запрос на очистку истории сообщений');
        await this.showModal({
            title: 'Подтверждение',
            content: '<p>Вы уверены, что хотите очистить историю сообщений?</p>',
            buttons: [
                {
                    text: 'Отмена',
                    type: 'secondary',
                    action: () => log('очистка отменена пользователем')
                },
                {
                    text: 'Очистить',
                    type: 'primary',
                    action: async () => {
                        await this.clearMessages();
                        log('история сообщений очищена');
                    }
                }
            ]
        });
    } catch (error) {
        log.error('ошибка очистки истории: %o', error);
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
    const log = logger('chat-interface:actions:setActiveGroup');

    try {
        if (!group || !group.topic) {
            log.error('неверные данные группы: %o', group);
            throw new Error('Неверные данные группы');
        }

        log('установка активной группы: %s (%s)', group.name, group.topic);

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

        log('переключение на группу завершено: %s (%s)', group.name, group.topic);

    } catch (error) {
        log.error('ошибка установки активной группы: %o', error);
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
    const log = logger('chat-interface:actions:searchMessages');

    try {
        log('поиск сообщений: %s', query);

        if (!query.trim()) {
            // Если запрос пустой, показываем все сообщения
            log('пустой запрос - показ всех сообщений');
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
        log('найдено сообщений: %d', resultsCount);

        await this.showModal({
            title: 'Результаты поиска',
            content: `<p>Найдено сообщений: ${resultsCount}</p>`,
            buttons: [{ text: 'OK', type: 'primary' }],
            closeOnBackdropClick: true
        });

    } catch (error) {
        log.error('ошибка поиска сообщений: %o', error);
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
    const log = logger('chat-interface:actions:showNotification');

    if ('Notification' in window && Notification.permission === 'granted') {
        log('показ уведомления: %s', message);
        new Notification('Чат', {
            body: message,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
        log('запрос разрешения на уведомления');
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Чат', {
                    body: message,
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
                });
            }
        });
    }
}
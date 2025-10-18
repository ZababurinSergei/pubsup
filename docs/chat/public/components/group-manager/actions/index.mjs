/**
 * Фабричная функция для создания действий компонента GroupManager
 * @param {Object} context - Контекст компонента
 * @returns {Promise<Object>} Объект с методами действий
 */
export async function createActions(context) {
    let libp2p = null;
    let discoveredGroupsInterval = null;

    return {
        /**
         * Инициализация Libp2p для работы с группами
         * @async
         * @param {Object} libp2pInstance - Экземпляр Libp2p
         */
        initializeLibp2p: async function(libp2pInstance) {
            libp2p = libp2pInstance;

            // Запускаем периодический поиск групп
            this.startGroupDiscovery();

            console.log('[GroupManager] Libp2p инициализирован для управления группами');
        },

        /**
         * Запуск процесса обнаружения групп
         * @async
         */
        startGroupDiscovery: async function() {
            if (discoveredGroupsInterval) {
                clearInterval(discoveredGroupsInterval);
            }

            // Обновляем список групп каждые 10 секунд
            discoveredGroupsInterval = setInterval(async () => {
                await this.discoverGroups();
            }, 10000);

            // Первоначальное обнаружение
            await this.discoverGroups();
        },

        /**
         * Обнаружение доступных групп через PubSub
         * @async
         */
        discoverGroups: async function() {
            if (!libp2p) {
                console.warn('[GroupManager] Libp2p не инициализирован');
                return;
            }

            try {
                // Получаем список активных топиков из PubSub
                const topics = libp2p.services.pubsub?.getTopics() || [];

                const groupTopics = topics.filter(topic =>
                    topic.startsWith('chat-group-') ||
                    topic.startsWith('universe-chat-')
                );

                const discoveredGroups = [];

                for (const topic of groupTopics) {
                    try {
                        const subscribers = libp2p.services.pubsub.getSubscribers(topic);
                        const memberCount = subscribers.length;

                        // Извлекаем название группы из топика
                        let groupName = topic;
                        if (topic.startsWith('chat-group-')) {
                            groupName = topic.replace('chat-group-', '').split('-')[0];
                        } else if (topic.startsWith('universe-chat-')) {
                            groupName = topic.replace('universe-chat-', '');
                        }

                        // Получаем дополнительную информацию о группе через DHT (если доступно)
                        let groupInfo = {
                            id: topic,
                            name: this.formatGroupName(groupName),
                            topic: topic,
                            memberCount: memberCount,
                            description: this.generateGroupDescription(groupName),
                            isPublic: true,
                            discoveryTime: Date.now()
                        };

                        discoveredGroups.push(groupInfo);
                    } catch (error) {
                        console.warn(`[GroupManager] Ошибка получения информации о группе ${topic}:`, error);
                    }
                }

                // Обновляем состояние компонента
                context.state.discoveredGroups = discoveredGroups;

                // Уведомляем компонент об обновлении
                if (context.renderPart) {
                    await context.renderPart({
                        partName: 'renderDiscoveredGroups',
                        state: context.state,
                        selector: '#discovered-groups-list'
                    });
                }

                console.log(`[GroupManager] Обнаружено групп: ${discoveredGroups.length}`);

            } catch (error) {
                console.error('[GroupManager] Ошибка обнаружения групп:', error);
                context.addError({
                    componentName: 'GroupManager',
                    source: 'discoverGroups',
                    message: 'Ошибка обнаружения групп',
                    details: error
                });
            }
        },

        /**
         * Создание новой группы чата
         * @async
         * @param {string} groupName - Название группы
         * @param {Object} options - Дополнительные опции
         * @returns {Promise<Object>} Созданная группа
         */
        createGroup: async function(groupName, options = {}) {
            if (!libp2p) {
                throw new Error('Libp2p не инициализирован');
            }

            try {
                // Создаем уникальный топик для группы
                const topic = `chat-group-${this.sanitizeTopicName(groupName)}-${Date.now()}`;

                const group = {
                    id: topic,
                    name: groupName,
                    topic: topic,
                    memberCount: 1,
                    description: options.description || `Группа для общения: ${groupName}`,
                    isPublic: options.isPublic !== false,
                    createdAt: Date.now(),
                    createdBy: libp2p.peerId.toString()
                };

                // Подписываемся на топик группы
                await libp2p.services.pubsub.subscribe(topic);

                // Публикуем информацию о создании группы
                if (group.isPublic) {
                    await this.announceGroupCreation(group);
                }

                console.log(`[GroupManager] Создана группа: ${groupName} (${topic})`);

                return group;

            } catch (error) {
                console.error('[GroupManager] Ошибка создания группы:', error);
                context.addError({
                    componentName: 'GroupManager',
                    source: 'createGroup',
                    message: 'Ошибка создания группы',
                    details: error
                });
                throw error;
            }
        },

        /**
         * Присоединение к существующей группе
         * @async
         * @param {string} topic - Топик группы
         * @returns {Promise<Object>} Информация о группе
         */
        joinGroup: async function(topic) {
            if (!libp2p) {
                throw new Error('Libp2p не инициализирован');
            }

            try {
                // Подписываемся на топик группы
                await libp2p.services.pubsub.subscribe(topic);

                // Получаем информацию о группе
                const subscribers = libp2p.services.pubsub.getSubscribers(topic);
                const memberCount = subscribers.length;

                const group = {
                    id: topic,
                    name: this.extractGroupNameFromTopic(topic),
                    topic: topic,
                    memberCount: memberCount,
                    description: `Присоединенная группа: ${this.extractGroupNameFromTopic(topic)}`,
                    joinedAt: Date.now(),
                    isPublic: true
                };

                console.log(`[GroupManager] Присоединились к группе: ${group.name} (${topic})`);

                return group;

            } catch (error) {
                console.error('[GroupManager] Ошибка присоединения к группе:', error);
                context.addError({
                    componentName: 'GroupManager',
                    source: 'joinGroup',
                    message: 'Ошибка присоединения к группе',
                    details: error
                });
                throw error;
            }
        },

        /**
         * Выход из группы
         * @async
         * @param {string} topic - Топик группы
         */
        leaveGroup: async function(topic) {
            if (!libp2p) {
                throw new Error('Libp2p не инициализирован');
            }

            try {
                // Отписываемся от топика группы
                await libp2p.services.pubsub.unsubscribe(topic);

                console.log(`[GroupManager] Покинули группу: ${topic}`);

            } catch (error) {
                console.error('[GroupManager] Ошибка выхода из группы:', error);
                context.addError({
                    componentName: 'GroupManager',
                    source: 'leaveGroup',
                    message: 'Ошибка выхода из группы',
                    details: error
                });
                throw error;
            }
        },

        /**
         * Поиск групп по названию или описанию
         * @async
         * @param {string} query - Поисковый запрос
         * @returns {Promise<Array>} Найденные группы
         */
        searchGroups: async function(query) {
            if (!query || !query.trim()) {
                return context.state.discoveredGroups || [];
            }

            const searchTerm = query.toLowerCase().trim();

            const filteredGroups = (context.state.discoveredGroups || []).filter(group =>
                group.name.toLowerCase().includes(searchTerm) ||
                (group.description && group.description.toLowerCase().includes(searchTerm)) ||
                group.topic.toLowerCase().includes(searchTerm)
            );

            console.log(`[GroupManager] Поиск "${query}": найдено ${filteredGroups.length} групп`);

            return filteredGroups;
        },

        /**
         * Получение списка участников группы
         * @async
         * @param {string} topic - Топик группы
         * @returns {Promise<Array>} Список участников
         */
        getGroupMembers: async function(topic) {
            if (!libp2p) {
                return [];
            }

            try {
                const subscribers = libp2p.services.pubsub.getSubscribers(topic);
                return subscribers.map(peerId => peerId.toString());
            } catch (error) {
                console.warn(`[GroupManager] Ошибка получения участников группы ${topic}:`, error);
                return [];
            }
        },

        /**
         * Анонсирование создания новой группы
         * @async
         * @param {Object} group - Информация о группе
         */
        announceGroupCreation: async function(group) {
            if (!libp2p) return;

            try {
                const announcement = {
                    type: 'group_announcement',
                    group: {
                        id: group.id,
                        name: group.name,
                        topic: group.topic,
                        description: group.description,
                        createdAt: group.createdAt,
                        createdBy: group.createdBy
                    },
                    timestamp: Date.now()
                };

                // Публикуем анонс в специальный топик для обнаружения групп
                const announcementTopic = 'chat-group-announcements';
                await libp2p.services.pubsub.publish(
                    announcementTopic,
                    new TextEncoder().encode(JSON.stringify(announcement))
                );

            } catch (error) {
                console.warn('[GroupManager] Ошибка анонсирования группы:', error);
            }
        },

        /**
         * Форматирование названия группы
         * @param {string} rawName - Сырое название
         * @returns {string} Отформатированное название
         */
        formatGroupName: function(rawName) {
            return rawName
                .replace(/[_-]/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase())
                .trim();
        },

        /**
         * Генерация описания группы
         * @param {string} groupName - Название группы
         * @returns {string} Описание группы
         */
        generateGroupDescription: function(groupName) {
            const descriptions = [
                `Группа для обсуждения: ${groupName}`,
                `Сообщество по интересам: ${groupName}`,
                `Чат группы: ${groupName}`,
                `Обсуждение темы: ${groupName}`
            ];

            return descriptions[Math.floor(Math.random() * descriptions.length)];
        },

        /**
         * Санитизация названия для топика
         * @param {string} name - Исходное название
         * @returns {string} Санитизированное название
         */
        sanitizeTopicName: function(name) {
            return name
                .toLowerCase()
                .replace(/[^a-z0-9а-яё]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
        },

        /**
         * Извлечение названия группы из топика
         * @param {string} topic - Топик группы
         * @returns {string} Название группы
         */
        extractGroupNameFromTopic: function(topic) {
            if (topic.startsWith('chat-group-')) {
                const parts = topic.replace('chat-group-', '').split('-');
                return this.formatGroupName(parts[0]);
            }
            return this.formatGroupName(topic);
        },

        /**
         * Очистка ресурсов
         * @async
         */
        cleanup: async function() {
            if (discoveredGroupsInterval) {
                clearInterval(discoveredGroupsInterval);
                discoveredGroupsInterval = null;
            }

            libp2p = null;
            console.log('[GroupManager] Ресурсы очищены');
        }
    };
}
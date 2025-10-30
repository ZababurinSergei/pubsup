import {parseChatGroupStringRegex} from '../../utils/index.mjs'
import { logger } from '@libp2p/logger';
const log = logger('chat-manager:actions');

/**
 * Фабричная функция для создания действий компонента ChatManager
 * @param {Object} context - Контекст компонента
 * @returns {Promise<Object>} Объект с методами действий
 */
export async function createActions(context) {
    let isGlobalHandlerRegistered = false;

    return {
        async registerGlobalMessageHandler() {
            if (!context.node || isGlobalHandlerRegistered) return;

            try {
                context.node.services.pubsub.addEventListener('message', async (event) => {
                    const { topic, data, from } = event.detail;

                    // Игнорируем служебный топик анонсов
                    if (topic === 'chat-groups-announcements') return;

                    // Обрабатываем только публичные чат-топики
                    if (topic.startsWith('chat-group-')) {
                        try {
                            const text = new TextDecoder().decode(data);
                            log('Получено сообщение из топика %s: %s', topic, text);

                            // Определяем, является ли сообщение нашим
                            const isOwnMessage = from && context.node.peerId && from.toString() === context.node.peerId.toString();
                            const messageType = isOwnMessage ? 'sent' : 'received';
                            const messageFrom = isOwnMessage ? context.state.peerId : from.toString(); // или from.toString(), если нужно

                            console.log('------------- HISTORY -------------')
                            // Сохраняем в историю топика
                            await context.addMessageToTopicHistory({
                                text,
                                topic,
                                from: messageFrom,
                                type: messageType,
                                timestamp: Date.now()
                            });

                            // Если этот топик сейчас активен — обновляем интерфейс
                            if (context.state.currentGroup?.topic === topic) {
                                const chatInterface = await context.getComponentAsync('chat-interface', 'main-chat');
                                if (chatInterface) {
                                    await chatInterface.postMessage({
                                        type: 'INCOMING_MESSAGE',
                                        data: {
                                            text,
                                            topic,
                                            from: messageFrom,
                                            type: messageType,
                                            timestamp: Date.now()
                                        }
                                    });
                                }
                            }
                        } catch (error) {
                            log.error('Ошибка обработки сообщения из топика %s: %o', topic, error);
                        }
                    }
                });

                isGlobalHandlerRegistered = true;
                log('Глобальный обработчик PubSub-сообщений зарегистрирован');
            } catch (error) {
                log.error('Не удалось зарегистрировать глобальный обработчик: %o', error);
            }
        },
        /**
         * Подписывается на группу
         * @async
         * @param {string} topic - Топик группы
         */
        async subscribeToGroup(topic) {
            if (context.node) {
                try {
                    await context.node.services.pubsub.subscribe(topic);
                    log('Subscribed to group: %s', topic);
                    return true;
                } catch (error) {
                    log.error('Error subscribing to group %s: %o', topic, error);
                    return false;
                }
            }
            return false;
        },

        /**
         * Отписывается от группы
         * @async
         * @param {string} topic - Топик группы
         */
        async unsubscribeFromGroup(topic) {
            if (context.node) {
                try {
                    await context.node.services.pubsub.unsubscribe(topic);
                    log('Unsubscribed from group: %s', topic);
                    return true;
                } catch (error) {
                    log.error('Error unsubscribing from group %s: %o', topic, error);
                    return false;
                }
            }
            return false;
        },

        /**
         * Отправляет сообщение
         * @async
         * @param {string} topic - Топик группы
         * @param {string} messageText - Текст сообщения
         */
        async sendMessage(topic, messageText) {
            if (context.node) {
                try {
                    await context.node.services.pubsub.publish(topic, new TextEncoder().encode(messageText));
                    log('Message sent to topic %s: %s', topic, messageText);
                    return true;
                } catch (error) {
                    log.error('Error sending message to topic %s: %o', topic, error);
                    return false;
                }
            }
            return false;
        },

        /**
         * Обнаруживает группы
         * @async
         */
        async discoverGroups() {
            if (!context.node) return [];

            try {
                const topics = Array.from(context.node.services.pubsub.getTopics());
                const groups = [];
                const groupManager = await context.getComponentAsync('group-manager', 'group-manager');
                const allGroups = (groupManager.allGroups).all
                for (const topic of topics) {
                    if (topic.startsWith('chat-group-')) {
                        const peers = context.node.services.pubsub.getSubscribers(topic);
                        const group = allGroups.filter(item => item.id === topic)
                        if(group.length > 0) {
                            groups.push(Object.assign(group[0], {
                                topic: topic,
                                name: group[0].name,
                                memberCount: peers.size,
                                peers: Array.from(peers).map(p => p.toString())
                            }));
                        } else {
                            console.error('Должно быть, надо проверить')
                        }
                    }
                }

                return groups;
            } catch (error) {
                log.error('Error discovering groups: %o', error);
                return [];
            }
        }
    };
}
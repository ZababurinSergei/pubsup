import { CreateLibp2p } from './libp2p-config.js';

export async function createActions(context) {
    let libp2p = null;
    let chatInterface = null;
    let groupManager = null;

    return {
        async initializeLibp2p() {
            try {
                libp2p = await CreateLibp2p(context.state.mode);

                console.log(`Libp2p инициализирован в режиме: ${context.state.mode}`);
                console.log('Peer ID:', libp2p.peerId.toString());
                console.log('Адреса прослушивания:', libp2p.getMultiaddrs().map(ma => ma.toString()));

                // Получаем компоненты интерфейса
                chatInterface = await context.getComponentAsync('chat-interface', 'main-chat');
                groupManager = await context.getComponentAsync('group-manager', 'group-manager');

                if (chatInterface) {
                    await chatInterface.updateConnectionStatus(true);
                }

                // Настройка обработчиков событий Libp2p
                libp2p.addEventListener('peer:discovery', (evt) => {
                    const peerId = evt.detail.id.toString();
                    console.log('Обнаружен пир:', peerId);
                    context.addMessage({
                        text: `Обнаружен новый пир: ${peerId}`,
                        type: 'system',
                        timestamp: Date.now()
                    });
                });

                libp2p.addEventListener('peer:connect', (evt) => {
                    const peerId = evt.detail.toString();
                    console.log('Подключен к пиру:', peerId);
                    context.addMessage({
                        text: `Подключен к пиру: ${peerId}`,
                        type: 'system',
                        timestamp: Date.now()
                    });
                });

                libp2p.addEventListener('peer:disconnect', (evt) => {
                    const peerId = evt.detail.toString();
                    console.log('Отключен от пира:', peerId);
                    context.addMessage({
                        text: `Отключен от пира: ${peerId}`,
                        type: 'system',
                        timestamp: Date.now()
                    });
                });

                // Обработка входящих сообщений PubSub
                libp2p.services.pubsub.addEventListener('message', (event) => {
                    try {
                        const messageText = new TextDecoder().decode(event.detail.data);
                        const topic = event.detail.topic;
                        const fromPeer = event.detail.from.toString();

                        console.log(`Получено сообщение в теме ${topic} от ${fromPeer}: ${messageText}`);

                        const message = {
                            text: messageText,
                            topic: topic,
                            from: fromPeer,
                            type: 'received',
                            timestamp: Date.now(),
                            id: Math.random().toString(36).substr(2, 9)
                        };

                        context.addMessage(message);

                        // Если это сообщение о создании группы, добавляем в discovered
                        if (messageText.startsWith('GROUP_CREATED:')) {
                            const groupData = JSON.parse(messageText.replace('GROUP_CREATED:', ''));
                            if (groupManager) {
                                groupManager.addDiscoveredGroup(groupData);
                            }
                        }

                    } catch (error) {
                        console.error('Ошибка обработки входящего сообщения:', error);
                    }
                });

                // Автоподписка на общие топики для обнаружения
                await this.subscribeToGroup('chat-discovery');

                return libp2p;
            } catch (error) {
                console.error('Ошибка инициализации Libp2p:', error);
                context.addMessage({
                    text: `Ошибка инициализации: ${error.message}`,
                    type: 'error',
                    timestamp: Date.now()
                });
                throw error;
            }
        },

        async subscribeToGroup(topic) {
            if (libp2p) {
                try {
                    await libp2p.services.pubsub.subscribe(topic);
                    console.log(`Успешно подписались на группу: ${topic}`);

                    context.addMessage({
                        text: `Подписались на группу: ${topic}`,
                        type: 'system',
                        timestamp: Date.now()
                    });

                    return true;
                } catch (error) {
                    console.error(`Ошибка подписки на группу ${topic}:`, error);
                    context.addMessage({
                        text: `Ошибка подписки на группу ${topic}: ${error.message}`,
                        type: 'error',
                        timestamp: Date.now()
                    });
                    return false;
                }
            }
            return false;
        },

        async unsubscribeFromGroup(topic) {
            if (libp2p) {
                try {
                    await libp2p.services.pubsub.unsubscribe(topic);
                    console.log(`Отписались от группы: ${topic}`);

                    context.addMessage({
                        text: `Отписались от группы: ${topic}`,
                        type: 'system',
                        timestamp: Date.now()
                    });

                    return true;
                } catch (error) {
                    console.error(`Ошибка отписки от группы ${topic}:`, error);
                    return false;
                }
            }
            return false;
        },

        async sendMessage(topic, messageText) {
            if (libp2p) {
                try {
                    await libp2p.services.pubsub.publish(topic, new TextEncoder().encode(messageText));
                    console.log(`Сообщение отправлено в тему ${topic}: ${messageText}`);

                    const chatMessage = {
                        text: messageText,
                        topic: topic,
                        from: libp2p.peerId.toString(),
                        type: 'sent',
                        timestamp: Date.now(),
                        id: Math.random().toString(36).substr(2, 9)
                    };

                    context.addMessage(chatMessage);
                    return true;
                } catch (error) {
                    console.error(`Ошибка отправки сообщения в тему ${topic}:`, error);
                    context.addMessage({
                        text: `Ошибка отправки сообщения: ${error.message}`,
                        type: 'error',
                        timestamp: Date.now()
                    });
                    return false;
                }
            }
            return false;
        },

        async createAndAnnounceGroup(groupData) {
            if (libp2p) {
                try {
                    const announcement = `GROUP_CREATED:${JSON.stringify(groupData)}`;
                    await libp2p.services.pubsub.publish('chat-discovery', new TextEncoder().encode(announcement));
                    console.log('Анонсирована новая группа:', groupData.name);
                    return true;
                } catch (error) {
                    console.error('Ошибка анонсирования группы:', error);
                    return false;
                }
            }
            return false;
        },

        async discoverGroups() {
            if (libp2p) {
                try {
                    // Получаем список топиков, на которые подписаны
                    const topics = Array.from(libp2p.services.pubsub.getTopics());
                    console.log('Доступные топики:', topics);

                    // Ищем пиров в топиках
                    const groups = [];
                    for (const topic of topics) {
                        if (topic.startsWith('chat-group-')) {
                            const peers = libp2p.services.pubsub.getSubscribers(topic);
                            groups.push({
                                topic: topic,
                                name: topic.replace('chat-group-', '').split('-')[0],
                                memberCount: peers.size,
                                peers: Array.from(peers).map(p => p.toString())
                            });
                        }
                    }

                    return groups;
                } catch (error) {
                    console.error('Ошибка поиска групп:', error);
                    return [];
                }
            }
            return [];
        },

        async connectToPeer(multiaddr) {
            if (libp2p) {
                try {
                    const ma = multiaddr;
                    console.log('Подключаемся к:', ma);

                    await libp2p.dial(ma);

                    context.addMessage({
                        text: `Успешно подключились к: ${ma}`,
                        type: 'system',
                        timestamp: Date.now()
                    });

                    return true;
                } catch (error) {
                    console.error('Ошибка подключения к пиру:', error);
                    context.addMessage({
                        text: `Ошибка подключения к ${multiaddr}: ${error.message}`,
                        type: 'error',
                        timestamp: Date.now()
                    });
                    throw error;
                }
            }
            return false;
        },

        async getConnectedPeers() {
            if (libp2p) {
                return Array.from(libp2p.getPeers()).map(peerId => ({
                    id: peerId.toString(),
                    connections: libp2p.getConnections(peerId).map(conn => ({
                        id: conn.id,
                        remoteAddr: conn.remoteAddr.toString(),
                        status: conn.status
                    }))
                }));
            }
            return [];
        },

        async getListeningAddresses() {
            if (libp2p) {
                return libp2p.getMultiaddrs().map(ma => ma.toString());
            }
            return [];
        },

        async getPeerId() {
            if (libp2p) {
                return libp2p.peerId.toString();
            }
            return null;
        },

        async cleanup() {
            if (libp2p) {
                try {
                    // Отписываемся от всех топиков
                    const topics = Array.from(libp2p.services.pubsub.getTopics());
                    for (const topic of topics) {
                        await libp2p.services.pubsub.unsubscribe(topic);
                    }

                    await libp2p.stop();
                    libp2p = null;

                    console.log('Libp2p остановлен и очищен');

                    if (chatInterface) {
                        await chatInterface.updateConnectionStatus(false);
                    }
                } catch (error) {
                    console.error('Ошибка очистки Libp2p:', error);
                }
            }
        },

        async switchToDialerMode() {
            await this.cleanup();
            return await this.initializeLibp2p();
        },

        async switchToListenerMode() {
            await this.cleanup();
            return await this.initializeLibp2p();
        }
    };
}
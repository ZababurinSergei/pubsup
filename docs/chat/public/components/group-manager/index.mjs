import { BaseComponent } from '../../base/base-component.mjs';
import * as template from './template/index.mjs';
import { controller } from './controller/index.mjs';
import { createActions } from './actions/index.mjs';
import { logger } from '@libp2p/logger';

export class GroupManager extends BaseComponent {
    constructor() {
        super();
        this._templateMethods = template;
        this.log = logger('group-manager');
        this.state = {
            groups: [],
            discoveredGroups: [],
            searchQuery: '',
            joinedGroups: [],
            nodeReady: false,
            _initialized: false // Флаг полной инициализации
        };
        this._nodeCheckInterval = null;
    }

    async _componentReady() {
        this.log('component ready');

        this._controller = await controller(this);
        this._actions = await createActions(this);

        this.log('controller and actions created: %o', {
            hasController: !!this._controller,
            hasActions: !!this._actions
        });

        // Сначала рендерим компонент
        await this.fullRender(this.state);

        // Запускаем инициализацию ноды
        await this.startNodeInitialization();

        await this._controller.init();

        this.state._initialized = true;

        // Автоматический поиск групп при старте
        setTimeout(async () => {
            if (this.state.nodeReady) {
                try {
                    this.log('автоматический поиск групп при старте');
                    await this.discoverGroups();
                } catch (error) {
                    this.log('автоматический поиск не удался: %o', error);
                }
            }
        }, 3000);

        return true;
    }

    async startNodeInitialization() {
        this.log('starting node initialization check');

        this._nodeCheckInterval = setInterval(async () => {
            try {
                await this.initializeFromPeerConnection();
            } catch (error) {
                this.log('waiting for node');
            }
        }, 2000);

        // Первоначальная попытка
        await this.initializeFromPeerConnection();
    }

    get allGroups() {
        return {
            groups: [...this.state.groups, ...this.state.joinedGroups],
            discovered: [...this.state.discoveredGroups],
            all: [...this.state.discoveredGroups, ...this.state.groups, ...this.state.joinedGroups],
            discoveredGroups: this.state.discoveredGroups,
            joinedGroups: this.state.joinedGroups
        }
    }
    // ✅ ДОБАВЛЕНО: обработка события перезапуска ноды
    async postMessage(event) {
        if (event.type === 'NODE_RESTARTED') {
            await this.handleNodeRestart();
            return;
        }

        switch (event.type) {
            case 'REQUEST_ACTIVE_GROUPS':
                const activeGroups = [...(this.state.groups || []), ...(this.state.joinedGroups || [])];
                const requester = await this.getComponentAsync('chat-interface', 'main-chat');
                if (requester) {
                    await requester.postMessage({
                        type: 'ACTIVE_GROUPS_RESPONSE',
                        data: { activeGroups }
                    });
                }
                break;
            default:
                log.error('Неизвестный тип сообщения: %s', event.type);
        }

        // Остальные типы сообщений (если понадобятся в будущем)
        this.log('Получено необработанное сообщение: %s', event.type);
    }

    // В GroupManager улучшаем обработку перезапуска
    async handleNodeRestart() {
        this.log('Обработка перезапуска ноды в GroupManager');

        // Сбрасываем состояние
        this.state.nodeReady = false;
        this.state.groups = [];
        this.state.discoveredGroups = [];
        this.state.joinedGroups = [];

        // Перезапускаем инициализацию
        await this.startNodeInitialization();

        this.log('GroupManager готов к работе с новой нодой');
    }

    async initializeFromPeerConnection() {
        try {
            // Получаем компонент peer-connection
            const peerConnection = await this.getComponentAsync('peer-connection', 'peer-connection');

            if (!peerConnection) {
                this.log('peer connection component not found');
                return false;
            }

            // Проверяем готовность ноды
            if (peerConnection.isNodeReady && peerConnection.isNodeReady()) {
                const node = peerConnection.getNode();

                // Дополнительная проверка, что PubSub запущен
                if (node && node.services && node.services.pubsub) {
                    // Инициализируем actions с нодой
                    await this._actions.initializeLibp2p(node);

                    this.state.nodeReady = true;

                    // Останавливаем интервал проверки
                    if (this._nodeCheckInterval) {
                        clearInterval(this._nodeCheckInterval);
                        this._nodeCheckInterval = null;
                    }

                    this.log('node obtained from peer connection for group manager, pubsub is ready');
                    await this.safeUpdateUI();
                    return true;
                } else {
                    this.log('node found but pubsub not ready yet');
                    return false;
                }
            }

            return false;

        } catch (error) {
            this.log.error('failed to initialize from peer connection: %o', error);
            return false;
        }
    }

    async safeUpdateUI() {
        try {
            // Пытаемся обновить через renderPart
            const updates = [];

            // Обновляем статус ноды если элемент существует
            const nodeStatusElement = this.shadowRoot.querySelector('.node-status-section');
            if (nodeStatusElement && this.renderPart) {
                updates.push(
                    this.renderPart({
                        partName: 'renderNodeStatus',
                        state: this.state,
                        selector: '.node-status-section'
                    }).catch(() => {
                        this.log('node status element not available for renderPart');
                    })
                );
            }

            // Обновляем быстрые действия если элемент существует
            const quickActionsElement = this.shadowRoot.querySelector('.quick-actions');
            if (quickActionsElement && this.renderPart) {
                updates.push(
                    this.renderPart({
                        partName: 'renderQuickActions',
                        state: this.state,
                        selector: '.quick-actions'
                    }).catch(() => {
                        this.log('quick actions element not available for renderPart');
                    })
                );
            }

            await Promise.allSettled(updates);

        } catch (error) {
            this.log('error in safeUpdateUI: %o', error);
            // Если renderPart не работает, используем полный рендер
            await this.fullRender(this.state);
        }
    }

    async safeRenderPart(options) {
        try {
            if (!this.renderPart) {
                this.log('renderPart method not available');
                return false;
            }

            const element = this.shadowRoot.querySelector(options.selector);
            if (!element) {
                this.log('element with selector %s not found', options.selector);
                return false;
            }

            await this.renderPart(options);
            return true;
        } catch (error) {
            this.log('error in safeRenderPart for %s: %o', options.selector, error);
            return false;
        }
    }

    async createGroup(input) {
        // Проверяем готовность ноды
        if (!this.state.nodeReady) {
            throw new Error('P2P нода не готова. Подождите немного и попробуйте снова.');
        }

        try {
            console.log('#################################### input ##############', input)
            let group;
            console.log('group-manager: createGroup', input)
            if (typeof input === 'string') {
                // Создание новой группы
                const groupName = input.trim();
                if (!groupName) {
                    throw new Error('Название группы не может быть пустым');
                }

                this.log('creating group: %s', groupName);
                group = await this._actions.createGroup(groupName);
                this.log('group created: %o', group);

                // Обновляем локальный список "моих групп"
                this.state.groups = [...this.state.groups];

            } else if (input && typeof input === 'object') {
                // Подключение к существующей группе
                const groupData = input;
                if (!groupData.topic) {
                    throw new Error('Объект группы должен содержать поле "topic"');
                }

                this.log('joining existing group: %s (%s)', groupData.name || groupData.topic, groupData.topic);
                group = await this.joinGroup(groupData);
                this.log('joined group: %o', group);

            } else {
                throw new Error('Неверный тип аргумента: ожидается строка или объект группы');
            }

            // Обновление UI
            let uiUpdated = false;
            try {
                uiUpdated = await this.safeRenderPart({
                    partName: 'renderMyGroups',
                    state: this.state,
                    selector: '#my-groups-list'
                });
                this.log('UI updated via renderPart: %s', uiUpdated);
            } catch (error) {
                this.log.error('Error updating via renderPart: %o', error);
            }

            if (!uiUpdated) {
                this.log('Using full render as fallback');
                await this.fullRender(this.state);
                uiUpdated = true;
            }

            // Уведомляем другие компоненты
            await this.notifyGroupCreation(group);

            this.log('Group operation completed, UI updated: %s', uiUpdated);

            return group;

        } catch (error) {
            this.log.error('error in createGroup: %o', error);

            if (error.message.includes('Pubsub has not started')) {
                this.state.nodeReady = false;
                await this.safeUpdateUI();
                throw new Error('Сервис сообщений не готов. Попробуйте через несколько секунд.');
            }

            throw error;
        }
    }

    /**
     * Принудительно обновляет список моих групп
     */
    async forceUpdateMyGroups() {
        try {
            this.log('Force updating my groups list');

            // Обновляем состояние
            this.state = {...this.state};

            // Пытаемся обновить через renderPart
            const success = await this.safeRenderPart({
                partName: 'renderMyGroups',
                state: this.state,
                selector: '#my-groups-list'
            });

            if (!success) {
                // Fallback to full render
                await this.fullRender(this.state);
            }

            this.log('My groups list updated successfully');
        } catch (error) {
            this.log.error('Error in forceUpdateMyGroups: %o', error);
            await this.fullRender(this.state);
        }
    }

    async safeUpdateGroupsList() {
        try {
            // Пытаемся обновить список моих групп
            const myGroupsUpdated = await this.safeRenderPart({
                partName: 'renderMyGroups',
                state: this.state,
                selector: '#my-groups-list'
            });

            if (!myGroupsUpdated) {
                // Если не удалось, делаем полный рендер
                await this.fullRender(this.state);
            }
        } catch (error) {
            this.log('error updating groups list: %o', error);
            await this.fullRender(this.state);
        }
    }

    async discoverGroups() {
        if (!this.state.nodeReady) {
            throw new Error('P2P нода не готова.');
        }

        try {
            await this._actions.discoverGroups();

            // Безопасное обновление списка обнаруженных групп
            await this.safeUpdateDiscoveredGroups();

        } catch (error) {
            this.log.error('error discovering groups: %o', error);
            throw error;
        }
    }

    async safeUpdateDiscoveredGroups() {
        try {
            const updated = await this.safeRenderPart({
                partName: 'renderDiscoveredGroups',
                state: this.state,
                selector: '#discovered-groups-list'
            });

            if (!updated) {
                this.log('discovered groups list not found, using full render');
                await this.fullRender(this.state);
            }
        } catch (error) {
            this.log('error updating discovered groups: %o', error);
            await this.fullRender(this.state);
        }
    }

    async searchGroups(query) {
        try {
            this.state.searchQuery = query;
            const results = await this._actions.searchGroups(query);

            // Безопасное обновление результатов поиска
            await this.safeRenderPart({
                partName: 'renderSearchResults',
                state: { ...this.state, searchResults: results },
                selector: '#search-results'
            });

        } catch (error) {
            this.log.error('error searching groups: %o', error);
            throw error;
        }
    }

    async joinGroup(group) {
        if (!this.state.nodeReady) {
            throw new Error('P2P нода не готова.');
        }

        try {
            this.log('joining group: %s', group.name);
            const joinedGroup = await this._actions.joinGroup(group.topic || group.id);
            this.log('group joined: %o', joinedGroup);

            // Безопасное обновление списка присоединенных групп
            await this.safeUpdateJoinedGroups();

            return joinedGroup;
        } catch (error) {
            this.log.error('error joining group: %o', error);
            throw error;
        }
    }

    async safeUpdateJoinedGroups() {
        try {
            const updated = await this.safeRenderPart({
                partName: 'renderJoinedGroups',
                state: this.state,
                selector: '#joined-groups-list'
            });

            if (!updated) {
                await this.fullRender(this.state);
            }
        } catch (error) {
            this.log('error updating joined groups: %o', error);
            await this.fullRender(this.state);
        }
    }

    async leaveGroup(groupId) {
        if (!this.state.nodeReady) {
            throw new Error('P2P нода не готова.');
        }

        try {
            this.log('leaving group: %s', groupId);
            await this._actions.leaveGroup(groupId);
            this.log('group left: %s', groupId);

            await this.safeUpdateJoinedGroups();

        } catch (error) {
            this.log.error('error leaving group: %o', error);
            throw error;
        }
    }

    // Метод для принудительной проверки статуса ноды
    async checkNodeStatus() {
        try {
            const wasReady = this.state.nodeReady;
            await this.initializeFromPeerConnection();

            if (!wasReady && this.state.nodeReady) {
                await this.showModal({
                    title: 'Готово',
                    content: '<p>P2P нода готова к работе!</p>',
                    buttons: [{ text: 'OK', type: 'primary' }]
                });
            }

            return this.state.nodeReady;
        } catch (error) {
            this.log.error('error checking node status: %o', error);
            return false;
        }
    }

    /**
     * Уведомляет другие компоненты о создании группы и передаёт список активных групп
     */
    async notifyGroupCreation(group) {
        try {
            // Собираем актуальный список групп (мои + присоединённые)
            const activeGroups = [
                ...(this.state.groups || []),
                ...(this.state.joinedGroups || [])
            ];

            // Уведомляем chat-manager
            const chatManager = await this.getComponentAsync('chat-manager', 'chat-manager');
            if (chatManager) {
                await chatManager.postMessage({
                    type: 'GROUP_CREATED',
                    data: group
                });
            }

            // Уведомляем chat-interface с группой и списком активных групп
            const chatInterface = await this.getComponentAsync('chat-interface', 'main-chat');
            if (chatInterface) {
                await chatInterface.postMessage({
                    type: 'GROUP_CREATED',
                    data: group
                });

                // 🔥 Передаём список активных групп для обновления members-list
                await chatInterface.postMessage({
                    type: 'ACTIVE_GROUPS_UPDATED',
                    data: { activeGroups }
                });
            }

            this.log('Group creation notified to other components');
        } catch (error) {
            this.log.error('Error notifying group creation: %o', error);
        }
    }

    async _componentDisconnected() {
        if (this._nodeCheckInterval) {
            clearInterval(this._nodeCheckInterval);
            this._nodeCheckInterval = null;
        }

        if (this._controller && this._controller.destroy) {
            await this._controller.destroy();
        }
        if (this._actions && this._actions.cleanup) {
            await this._actions.cleanup();
        }
        this._templateMethods = null;
    }
}

if (!customElements.get('group-manager')) {
    customElements.define('group-manager', GroupManager);
}
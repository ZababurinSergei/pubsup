import { BaseComponent } from '../../base/base-component.mjs';
import * as template from './template/index.mjs';
import { controller } from './controller/index.mjs';
import { createActions } from './actions/index.mjs';

export class GroupManager extends BaseComponent {
    constructor() {
        super();
        this._templateMethods = template;
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
        console.log('🔧 GroupManager component ready');

        this._controller = await controller(this);
        this._actions = await createActions(this);

        // Сначала рендерим компонент
        await this.fullRender(this.state);
        await this._controller.init();

        // Затем запускаем инициализацию ноды
        await this.startNodeInitialization();

        this.state._initialized = true;
        return true;
    }

    async startNodeInitialization() {
        console.log('🔧 Starting node initialization check...');

        this._nodeCheckInterval = setInterval(async () => {
            try {
                await this.initializeFromPeerConnection();
            } catch (error) {
                console.log('⏳ Waiting for node...');
            }
        }, 2000);

        // Первоначальная попытка
        await this.initializeFromPeerConnection();
    }

    async initializeFromPeerConnection() {
        try {
            // Получаем компонент peer-connection
            const peerConnection = await this.getComponentAsync('peer-connection', 'peer-connection');

            if (!peerConnection) {
                console.warn('❌ PeerConnection component not found');
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

                    console.log('✅ Node obtained from PeerConnection for GroupManager, PubSub is ready');
                    await this.safeUpdateUI();
                    return true;
                } else {
                    console.log('⏳ Node found but PubSub not ready yet...');
                    return false;
                }
            }

            return false;

        } catch (error) {
            console.error('❌ Failed to initialize from PeerConnection:', error);
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
                        console.log('⚠️ Node status element not available for renderPart');
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
                        console.log('⚠️ Quick actions element not available for renderPart');
                    })
                );
            }

            await Promise.allSettled(updates);

        } catch (error) {
            console.warn('⚠️ Error in safeUpdateUI:', error);
            // Если renderPart не работает, используем полный рендер
            await this.fullRender(this.state);
        }
    }

    async safeRenderPart(options) {
        try {
            if (!this.renderPart) {
                console.warn('⚠️ renderPart method not available');
                return false;
            }

            const element = this.shadowRoot.querySelector(options.selector);
            if (!element) {
                console.warn(`⚠️ Element with selector '${options.selector}' not found`);
                return false;
            }

            await this.renderPart(options);
            return true;
        } catch (error) {
            console.warn(`⚠️ Error in safeRenderPart for '${options.selector}':`, error);
            return false;
        }
    }

    async createGroup(groupName) {
        // Проверяем готовность ноды
        if (!this.state.nodeReady) {
            throw new Error('P2P нода не готова. Подождите немного и попробуйте снова.');
        }

        try {
            console.log('🔧 Creating group in GroupManager:', groupName);
            const group = await this._actions.createGroup(groupName);
            console.log('✅ Group created:', group);

            // Безопасное обновление UI
            await this.safeUpdateGroupsList();

            return group;
        } catch (error) {
            console.error('❌ Error creating group:', error);

            // Если ошибка связана с PubSub, помечаем ноду как неготовую
            if (error.message.includes('Pubsub has not started')) {
                this.state.nodeReady = false;
                await this.safeUpdateUI();
                throw new Error('Сервис сообщений не готов. Попробуйте через несколько секунд.');
            }

            throw error;
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
            console.warn('⚠️ Error updating groups list:', error);
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
            console.error('❌ Error discovering groups:', error);
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
                console.log('⚠️ Discovered groups list not found, using full render');
                await this.fullRender(this.state);
            }
        } catch (error) {
            console.warn('⚠️ Error updating discovered groups:', error);
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
            console.error('❌ Error searching groups:', error);
            throw error;
        }
    }

    async joinGroup(group) {
        if (!this.state.nodeReady) {
            throw new Error('P2P нода не готова.');
        }

        try {
            console.log('🔧 Joining group in GroupManager:', group.name);
            const joinedGroup = await this._actions.joinGroup(group.topic || group.id);
            console.log('✅ Group joined:', joinedGroup);

            // Безопасное обновление списка присоединенных групп
            await this.safeUpdateJoinedGroups();

            return joinedGroup;
        } catch (error) {
            console.error('❌ Error joining group:', error);
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
            console.warn('⚠️ Error updating joined groups:', error);
            await this.fullRender(this.state);
        }
    }

    async leaveGroup(groupId) {
        if (!this.state.nodeReady) {
            throw new Error('P2P нода не готова.');
        }

        try {
            console.log('🔧 Leaving group in GroupManager:', groupId);
            await this._actions.leaveGroup(groupId);
            console.log('✅ Group left:', groupId);

            await this.safeUpdateJoinedGroups();

        } catch (error) {
            console.error('❌ Error leaving group:', error);
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
            console.error('❌ Error checking node status:', error);
            return false;
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
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
            joinedGroups: []
        };
    }

    async _componentReady() {
        this._controller = await controller(this);
        this._actions = await createActions(this);
        // await this._controller.init();
        return true;
    }

    async createGroup(groupName) {
        const group = {
            id: Math.random().toString(36).substr(2, 9),
            name: groupName,
            topic: `chat-group-${groupName}-${Date.now()}`,
            memberCount: 1,
            createdAt: Date.now(),
            isPublic: true
        };

        this.state.groups.push(group);
        await this.renderPart({
            partName: 'renderMyGroups',
            state: this.state,
            selector: '#my-groups-list'
        });

        return group;
    }

    async discoverGroups() {
        // Симуляция обнаружения групп через DHT или PubSub
        const mockDiscoveredGroups = [
            {
                id: 'discovered-1',
                name: 'Общий чат',
                topic: 'chat-general',
                memberCount: 5,
                description: 'Основной чат для общения'
            },
            {
                id: 'discovered-2',
                name: 'Технологии',
                topic: 'chat-tech',
                memberCount: 3,
                description: 'Обсуждение технологий'
            }
        ];

        this.state.discoveredGroups = mockDiscoveredGroups;
        await this.renderPart({
            partName: 'renderDiscoveredGroups',
            state: this.state,
            selector: '#discovered-groups-list'
        });
    }

    async searchGroups(query) {
        this.state.searchQuery = query;
        await this.renderPart({
            partName: 'renderSearchResults',
            state: this.state,
            selector: '#search-results'
        });
    }

    async joinGroup(group) {
        if (!this.state.joinedGroups.find(g => g.id === group.id)) {
            this.state.joinedGroups.push({
                ...group,
                joinedAt: Date.now()
            });
        }

        await this.renderPart({
            partName: 'renderJoinedGroups',
            state: this.state,
            selector: '#joined-groups-list'
        });

        return group;
    }

    async leaveGroup(groupId) {
        this.state.joinedGroups = this.state.joinedGroups.filter(g => g.id !== groupId);
        await this.renderPart({
            partName: 'renderJoinedGroups',
            state: this.state,
            selector: '#joined-groups-list'
        });
    }

    async _componentDisconnected() {
        if (this._controller && this._controller.destroy) {
            await this._controller.destroy();
        }
        this._templateMethods = null;
    }
}

if (!customElements.get('group-manager')) {
    customElements.define('group-manager', GroupManager);
}
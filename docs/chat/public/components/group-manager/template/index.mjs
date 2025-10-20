/**
 * Основной шаблон компонента GroupManager
 */
export default function defaultTemplate({ state = {} } = {}) {
    const { groups = [], discoveredGroups = [], joinedGroups = [], searchQuery = '' } = state;

    return `
        <div class="group-manager">
            ${renderHeader({ groups, discoveredGroups, joinedGroups })}
            ${renderSearch({ searchQuery })}
            ${renderMainContent({ groups, discoveredGroups, joinedGroups, searchQuery })}
        </div>
    `;
}

/**
 * Шаблон заголовка
 */
export function renderHeader({ groups = [], discoveredGroups = [], joinedGroups = [] } = {}) {
    return `
        <header class="manager-header">
            <div class="header-content">
                <h1 class="manager-title">Управление группами</h1>
                <div class="header-stats">
                    <div class="stat-item">
                        <span class="stat-label">Мои</span>
                        <span class="stat-value">${groups.length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Присоедин.</span>
                        <span class="stat-value">${joinedGroups.length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Найдено</span>
                        <span class="stat-value">${discoveredGroups.length}</span>
                    </div>
                </div>
            </div>
        </header>
    `;
}

/**
 * Шаблон поиска
 */
export function renderSearch({ searchQuery = '' } = {}) {
    return `
        <section class="search-section">
            <div class="search-container">
                <input 
                    type="text" 
                    id="group-search-input" 
                    class="search-input" 
                    placeholder="Поиск групп..."
                    value="${escapeHtml(searchQuery)}"
                >
                <button class="search-btn" id="search-groups">
                    <span>🔍</span>
                    Поиск
                </button>
            </div>
        </section>
    `;
}

/**
 * Основное содержимое
 */
export function renderMainContent({ groups = [], discoveredGroups = [], joinedGroups = [], searchQuery = '' } = {}) {
    return `
        <main class="manager-main">
            <div class="content-grid">
                ${renderMyGroups({ groups })}
                ${renderDiscoveredGroups({ discoveredGroups })}
                ${renderJoinedGroups({ joinedGroups })}
                ${searchQuery ? renderSearchResults({ groups, discoveredGroups, joinedGroups, searchQuery }) : ''}
            </div>
        </main>
    `;
}

/**
 * Мои группы
 */
export function renderMyGroups({ groups = [] } = {}) {
    return `
        <section class="section-card">
            <div class="card-header">
                <h3 class="card-title">Мои группы</h3>
                <span class="card-badge">${groups.length}</span>
            </div>
            <div class="card-content">
                ${groups.length > 0 ? renderGroupsList(groups, 'my') : renderEmptyState('my')}
            </div>
        </section>
    `;
}

/**
 * Обнаруженные группы
 */
export function renderDiscoveredGroups({ discoveredGroups = [] } = {}) {
    return `
        <section class="section-card">
            <div class="card-header">
                <h3 class="card-title">Обнаруженные</h3>
                <span class="card-badge">${discoveredGroups.length}</span>
            </div>
            <div class="card-content">
                ${discoveredGroups.length > 0 ? renderGroupsList(discoveredGroups, 'discovered') : renderEmptyState('discovered')}
            </div>
        </section>
    `;
}

/**
 * Присоединенные группы
 */
export function renderJoinedGroups({ joinedGroups = [] } = {}) {
    return `
        <section class="section-card">
            <div class="card-header">
                <h3 class="card-title">Присоединенные</h3>
                <span class="card-badge">${joinedGroups.length}</span>
            </div>
            <div class="card-content">
                ${joinedGroups.length > 0 ? renderGroupsList(joinedGroups, 'joined') : renderEmptyState('joined')}
            </div>
        </section>
    `;
}

/**
 * Результаты поиска
 */
export function renderSearchResults({ groups = [], discoveredGroups = [], joinedGroups = [], searchQuery = '' } = {}) {
    const allGroups = [...groups, ...discoveredGroups, ...joinedGroups];
    const filteredGroups = allGroups.filter(group =>
        group.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.topic?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return `
        <section class="section-card">
            <div class="card-header">
                <h3 class="card-title">Результаты поиска</h3>
                <span class="card-badge">${filteredGroups.length}</span>
            </div>
            <div class="card-content">
                ${filteredGroups.length > 0 ? renderGroupsList(filteredGroups, 'search') : renderEmptyState('search', searchQuery)}
            </div>
        </section>
    `;
}

/**
 * Список групп
 */
function renderGroupsList(groups, type) {
    return `
        <div class="groups-list">
            ${groups.map(group => renderGroupItem(group, type)).join('')}
        </div>
    `;
}

/**
 * Элемент группы
 */
function renderGroupItem(group, type) {
    const { id, name, topic, memberCount = 1, description } = group;

    return `
        <div class="group-item" data-group-id="${id}" data-group-topic="${topic}">
            <div class="group-avatar">
                ${name ? name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div class="group-info">
                <div class="group-name">${escapeHtml(name)}</div>
                <div class="group-meta">
                    <span class="meta-item">👥 ${memberCount}</span>
                    <span class="meta-item">${getGroupTypeLabel(type)}</span>
                </div>
            </div>
            <div class="group-actions">
                ${renderGroupActions(type, id, topic)}
            </div>
        </div>
    `;
}

/**
 * Действия для группы
 */
function renderGroupActions(type, groupId, topic) {
    switch (type) {
        case 'my':
            return `
                <button class="action-btn join" data-group-id="${groupId}" title="Перейти в чат">
                    💬
                </button>
                <button class="action-btn leave" data-group-id="${groupId}" title="Удалить">
                    🗑️
                </button>
            `;
        case 'discovered':
            return `
                <button class="action-btn join" data-group-id="${groupId}" data-topic="${topic}" title="Присоединиться">
                    ➕
                </button>
            `;
        case 'joined':
            return `
                <button class="action-btn join" data-group-id="${groupId}" title="Войти в чат">
                    💬
                </button>
                <button class="action-btn leave" data-group-id="${groupId}" title="Покинуть">
                    🚪
                </button>
            `;
        case 'search':
            return `
                <button class="action-btn join" data-group-id="${groupId}" data-topic="${topic}" title="Присоединиться">
                    ➕
                </button>
            `;
        default:
            return '';
    }
}

/**
 * Пустое состояние
 */
function renderEmptyState(type, searchQuery = '') {
    const states = {
        my: {
            icon: '🏠',
            title: 'Нет созданных групп',
            description: 'Создайте первую группу для общения',
            action: 'Создать группу'
        },
        discovered: {
            icon: '🌐',
            title: 'Группы не найдены',
            description: 'Обнаружьте доступные группы в сети',
            action: 'Обнаружить'
        },
        joined: {
            icon: '🤝',
            title: 'Нет присоединенных групп',
            description: 'Присоединяйтесь к группам для общения',
            action: 'Найти группы'
        },
        search: {
            icon: '🔍',
            title: `По запросу "${searchQuery}" ничего не найдено`,
            description: 'Попробуйте изменить поисковый запрос',
            action: 'Очистить поиск'
        }
    };

    const state = states[type] || states.my;

    return `
        <div class="empty-state">
            <div class="empty-icon">${state.icon}</div>
            <p class="empty-text">${state.title}</p>
            <button class="empty-action" id="${type}-action">
                ${state.action}
            </button>
        </div>
    `;
}

/**
 * Вспомогательные функции
 */
function getGroupTypeLabel(type) {
    const labels = {
        my: 'Моя',
        discovered: 'Публичная',
        joined: 'Присоедин.',
        search: 'Найдена'
    };
    return labels[type] || 'Группа';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
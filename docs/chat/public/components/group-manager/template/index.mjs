/**
 * Основной шаблон менеджера групп
 * @param {Object} params
 * @param {Object} params.state - Состояние компонента
 * @returns {string} HTML строка
 */
export default function defaultTemplate({state = {}} = {}) {
    return `
    <div class="group-manager">
        <!-- Заголовок и управление -->
        <header class="manager-header" id="header-section">
            ${renderHeader({state})}
        </header>
        
        <!-- Основное содержимое -->
        <main class="manager-main">
            <div class="manager-content">
                ${renderMyGroups({state})}
                ${renderDiscoveredGroups({state})}
                ${renderJoinedGroups({state})}
            </div>
        </main>
    </div>
    `;
}

/**
 * Шаблон для заголовочной части
 * @param {Object} params
 * @param {Object} params.state - Состояние компонента
 * @returns {string} HTML строка
 */
export function renderHeader({state = {}} = {}) {
    return `
    <div class="header-content">
        <h2 class="manager-title">Управление группами чата</h2>
        <p class="manager-subtitle">Создавайте, ищите и присоединяйтесь к группам для общения</p>
        
        <div class="header-stats">
            <div class="stat-item">
                <span class="stat-label">Мои группы:</span>
                <span class="stat-value">${state.groups?.length || 0}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Присоединено:</span>
                <span class="stat-value">${state.joinedGroups?.length || 0}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Найдено:</span>
                <span class="stat-value">${state.discoveredGroups?.length || 0}</span>
            </div>
        </div>
    </div>
    `;
}

/**
 * Шаблон для поиска групп
 * @param {Object} params
 * @param {Object} params.state - Состояние компонента
 * @returns {string} HTML строка
 */
export function renderSearch({state = {}} = {}) {
    return `
    <div class="search-content">
        <h3 class="section-title">Поиск групп</h3>
        <div class="search-controls">
            <input 
                type="text" 
                id="group-search" 
                class="search-input" 
                placeholder="Введите название группы или тему..."
                value="${state.searchQuery || ''}"
            >
            <button class="search-button" id="search-groups">
                <span class="search-icon">🔍</span>
                Поиск
            </button>
            <button class="discover-button secondary" id="discover-groups">
                <span class="discover-icon">🌐</span>
                Обнаружить группы
            </button>
        </div>
        
        ${state.searchQuery ? `
        <div class="search-info">
            <p>Результаты поиска для: <strong>"${state.searchQuery}"</strong></p>
        </div>
        ` : ''}
    </div>
    `;
}

/**
 * Шаблон для создания новой группы
 * @param {Object} params
 * @param {Object} params.state - Состояние компонента
 * @returns {string} HTML строка
 */
export function renderCreateGroup({state = {}} = {}) {
    return `
    <div class="create-group-content">
        <h3 class="section-title">Создать новую группу</h3>
        <div class="create-form">
            <div class="form-group">
                <label for="group-name" class="form-label">Название группы</label>
                <input 
                    type="text" 
                    id="group-name" 
                    class="form-input" 
                    placeholder="Введите название группы..."
                    maxlength="50"
                >
                <div class="char-counter">
                    <span id="char-count">0</span>/50 символов
                </div>
            </div>
            
            <div class="form-group">
                <label for="group-description" class="form-label">Описание (необязательно)</label>
                <textarea 
                    id="group-description" 
                    class="form-textarea" 
                    placeholder="Краткое описание группы..."
                    rows="3"
                    maxlength="200"
                ></textarea>
                <div class="char-counter">
                    <span id="desc-char-count">0</span>/200 символов
                </div>
            </div>
            
            <div class="form-options">
                <label class="checkbox-label">
                    <input type="checkbox" id="group-public" checked>
                    <span class="checkmark"></span>
                    Публичная группа (видна другим пользователям)
                </label>
                
                <label class="checkbox-label">
                    <input type="checkbox" id="group-encrypted">
                    <span class="checkmark"></span>
                    Зашифрованные сообщения
                </label>
            </div>
            
            <button class="create-button primary" id="create-group">
                <span class="create-icon">➕</span>
                Создать группу
            </button>
        </div>
    </div>
    `;
}

/**
 * Шаблон для моих групп
 * @param {Object} params
 * @param {Object} params.state - Состояние компонента
 * @returns {string} HTML строка
 */
export function renderMyGroups({state = {}} = {}) {
    const groups = state.groups || [];

    if (groups.length === 0) {
        return `
        <div class="my-groups-content">
            <div class="empty-state">
                <div class="empty-icon">🏠</div>
                <p class="empty-title">У вас пока нет созданных групп</p>
                <p class="empty-description">Создайте первую группу, чтобы начать общение</p>
            </div>
        </div>
        `;
    }

    return `
    <div class="my-groups-content">
        <h3 class="section-title">Мои группы (${groups.length})</h3>
        <div class="groups-grid" id="my-groups-list">
            ${groups.map(group => `
            <div class="group-card owned" data-group-id="${group.id}">
                <div class="group-header">
                    <h4 class="group-name">${group.name}</h4>
                    <span class="group-badge owner">Владелец</span>
                </div>
                
                <div class="group-info">
                    <p class="group-topic">Топик: <code>${group.topic}</code></p>
                    ${group.description ? `<p class="group-description">${group.description}</p>` : ''}
                </div>
                
                <div class="group-stats">
                    <div class="group-stat">
                        <span class="stat-icon">👥</span>
                        <span class="stat-value">${group.memberCount || 1} участников</span>
                    </div>
                    <div class="group-stat">
                        <span class="stat-icon">📅</span>
                        <span class="stat-value">${formatDate(group.createdAt)}</span>
                    </div>
                </div>
                
                <div class="group-actions">
                    <button class="action-btn primary join-group" data-group-id="${group.id}">
                        <span class="action-icon">💬</span>
                        Перейти в чат
                    </button>
                    <button class="action-btn secondary share-group" data-group-id="${group.id}">
                        <span class="action-icon">📤</span>
                        Поделиться
                    </button>
                    <button class="action-btn danger delete-group" data-group-id="${group.id}">
                        <span class="action-icon">🗑️</span>
                        Удалить
                    </button>
                </div>
            </div>
            `).join('')}
        </div>
    </div>
    `;
}

/**
 * Шаблон для обнаруженных групп
 * @param {Object} params
 * @param {Object} params.state - Состояние компонента
 * @returns {string} HTML строка
 */
export function renderDiscoveredGroups({state = {}} = {}) {
    const discoveredGroups = state.discoveredGroups || [];

    if (discoveredGroups.length === 0) {
        return `
        <div class="discovered-groups-content">
            <div class="empty-state">
                <div class="empty-icon">🌐</div>
                <p class="empty-title">Группы не обнаружены</p>
                <p class="empty-description">Нажмите "Обнаружить группы" для поиска доступных групп в сети</p>
            </div>
        </div>
        `;
    }

    return `
    <div class="discovered-groups-content">
        <h3 class="section-title">Обнаруженные группы (${discoveredGroups.length})</h3>
        <div class="groups-list" id="discovered-groups-list">
            ${discoveredGroups.map(group => `
            <div class="group-item discovered" data-group-id="${group.id}">
                <div class="group-main">
                    <div class="group-avatar">
                        <span class="avatar-icon">👥</span>
                    </div>
                    <div class="group-details">
                        <h4 class="group-name">${group.name}</h4>
                        ${group.description ? `<p class="group-description">${group.description}</p>` : ''}
                        <div class="group-meta">
                            <span class="meta-item">
                                <span class="meta-icon">👥</span>
                                ${group.memberCount || 0} участников
                            </span>
                            <span class="meta-item">
                                <span class="meta-icon">🔍</span>
                                ${group.isPublic ? 'Публичная' : 'Приватная'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="group-actions">
                    <button class="action-btn primary join-discovered" data-group-id="${group.id}" data-topic="${group.topic}">
                        <span class="action-icon">➕</span>
                        Присоединиться
                    </button>
                    <button class="action-btn secondary info-group" data-group-id="${group.id}">
                        <span class="action-icon">ℹ️</span>
                        Инфо
                    </button>
                </div>
            </div>
            `).join('')}
        </div>
    </div>
    `;
}

/**
 * Шаблон для присоединенных групп
 * @param {Object} params
 * @param {Object} params.state - Состояние компонента
 * @returns {string} HTML строка
 */
export function renderJoinedGroups({state = {}} = {}) {
    const joinedGroups = state.joinedGroups || [];

    if (joinedGroups.length === 0) {
        return `
        <div class="joined-groups-content">
            <div class="empty-state">
                <div class="empty-icon">🤝</div>
                <p class="empty-title">Вы еще не присоединились к группам</p>
                <p class="empty-description">Найдите интересные группы и присоединяйтесь к общению</p>
            </div>
        </div>
        `;
    }

    return `
    <div class="joined-groups-content">
        <h3 class="section-title">Присоединенные группы (${joinedGroups.length})</h3>
        <div class="groups-list" id="joined-groups-list">
            ${joinedGroups.map(group => `
            <div class="group-item joined" data-group-id="${group.id}">
                <div class="group-main">
                    <div class="group-avatar">
                        <span class="avatar-icon ${group.isPublic ? 'public' : 'private'}">
                            ${group.isPublic ? '🌐' : '🔒'}
                        </span>
                    </div>
                    <div class="group-details">
                        <h4 class="group-name">${group.name}</h4>
                        ${group.description ? `<p class="group-description">${group.description}</p>` : ''}
                        <div class="group-meta">
                            <span class="meta-item">
                                <span class="meta-icon">📅</span>
                                Присоединился: ${formatDate(group.joinedAt)}
                            </span>
                            <span class="meta-item">
                                <span class="meta-icon">👥</span>
                                ${group.memberCount || 1} участников
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="group-actions">
                    <button class="action-btn primary enter-chat" data-group-id="${group.id}" data-topic="${group.topic}">
                        <span class="action-icon">💬</span>
                        Войти в чат
                    </button>
                    <button class="action-btn secondary leave-group" data-group-id="${group.id}">
                        <span class="action-icon">🚪</span>
                        Покинуть
                    </button>
                </div>
            </div>
            `).join('')}
        </div>
    </div>
    `;
}

/**
 * Шаблон для результатов поиска
 * @param {Object} params
 * @param {Object} params.state - Состояние компонента
 * @returns {string} HTML строка
 */
export function renderSearchResults({state = {}} = {}) {
    if (!state.searchQuery) {
        return `
        <div class="search-results-content">
            <h3 class="section-title">Результаты поиска</h3>
            <div class="search-prompt">
                <p>Введите запрос в поле поиска для отображения результатов</p>
            </div>
        </div>
        `;
    }

    // Фильтрация групп по поисковому запросу
    const allGroups = [
        ...(state.groups || []),
        ...(state.discoveredGroups || []),
        ...(state.joinedGroups || [])
    ];

    const searchResults = allGroups.filter(group =>
        group.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        (group.description && group.description.toLowerCase().includes(state.searchQuery.toLowerCase())) ||
        group.topic.toLowerCase().includes(state.searchQuery.toLowerCase())
    );

    if (searchResults.length === 0) {
        return `
        <div class="search-results-content">
            <h3 class="section-title">Результаты поиска</h3>
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <p class="empty-title">По запросу "${state.searchQuery}" ничего не найдено</p>
                <p class="empty-description">Попробуйте изменить поисковый запрос или создать новую группу</p>
            </div>
        </div>
        `;
    }

    return `
    <div class="search-results-content">
        <h3 class="section-title">Результаты поиска (${searchResults.length})</h3>
        <div class="search-summary">
            <p>Найдено групп по запросу: <strong>"${state.searchQuery}"</strong></p>
        </div>
        
        <div class="groups-list" id="search-results">
            ${searchResults.map(group => `
            <div class="group-item search-result" data-group-id="${group.id}">
                <div class="group-main">
                    <div class="group-avatar">
                        <span class="avatar-icon ${getGroupTypeIcon(group)}">
                            ${getGroupTypeIcon(group)}
                        </span>
                    </div>
                    <div class="group-details">
                        <h4 class="group-name">${group.name}</h4>
                        <span class="group-type ${getGroupTypeClass(group)}">${getGroupTypeLabel(group)}</span>
                        ${group.description ? `<p class="group-description">${group.description}</p>` : ''}
                        <div class="group-meta">
                            <span class="meta-item">
                                <span class="meta-icon">👥</span>
                                ${group.memberCount || 1} участников
                            </span>
                            <span class="meta-item">
                                <span class="meta-icon">📅</span>
                                ${formatDate(group.createdAt || group.joinedAt)}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="group-actions">
                    ${getSearchResultActions(group, state)}
                </div>
            </div>
            `).join('')}
        </div>
    </div>
    `;
}

/**
 * Шаблон для статуса
 * @param {Object} params
 * @param {Object} params.state - Состояние компонента
 * @returns {string} HTML строка
 */
export function renderStatus({state = {}} = {}) {
    const totalGroups = (state.groups?.length || 0) + (state.joinedGroups?.length || 0);

    return `
    <div class="status-content">
        <div class="status-info">
            <div class="status-item">
                <span class="status-label">Всего групп:</span>
                <span class="status-value">${totalGroups}</span>
            </div>
            <div class="status-item">
                <span class="status-label">Активный поиск:</span>
                <span class="status-value ${state.searchQuery ? 'active' : 'inactive'}">
                    ${state.searchQuery ? 'Да' : 'Нет'}
                </span>
            </div>
        </div>
        
        ${state.lastAction ? `
        <div class="last-action">
            <span class="action-label">Последнее действие:</span>
            <span class="action-value">${state.lastAction}</span>
        </div>
        ` : ''}
    </div>
    `;
}

/**
 * Вспомогательная функция для форматирования даты
 * @param {number} timestamp - Временная метка
 * @returns {string} Отформатированная дата
 */
function formatDate(timestamp) {
    if (!timestamp) return 'Неизвестно';

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) { // Меньше минуты
        return 'Только что';
    } else if (diff < 3600000) { // Меньше часа
        const minutes = Math.floor(diff / 60000);
        return `${minutes} мин. назад`;
    } else if (diff < 86400000) { // Меньше суток
        const hours = Math.floor(diff / 3600000);
        return `${hours} ч. назад`;
    } else {
        return date.toLocaleDateString('ru-RU');
    }
}

/**
 * Получает иконку для типа группы
 * @param {Object} group - Объект группы
 * @returns {string} Символ иконки
 */
function getGroupTypeIcon(group) {
    if (group.owner) return '🏠';
    if (group.isPublic) return '🌐';
    return '🔒';
}

/**
 * Получает CSS класс для типа группы
 * @param {Object} group - Объект группы
 * @returns {string} CSS класс
 */
function getGroupTypeClass(group) {
    if (group.owner) return 'type-owner';
    if (group.isPublic) return 'type-public';
    return 'type-private';
}

/**
 * Получает метку для типа группы
 * @param {Object} group - Объект группы
 * @returns {string} Текст метки
 */
function getGroupTypeLabel(group) {
    if (group.owner) return 'Моя группа';
    if (group.isPublic) return 'Публичная';
    return 'Приватная';
}

/**
 * Генерирует действия для результатов поиска
 * @param {Object} group - Объект группы
 * @param {Object} state - Состояние компонента
 * @returns {string} HTML кнопок действий
 */
function getSearchResultActions(group, state) {
    const isOwned = state.groups?.some(g => g.id === group.id);
    const isJoined = state.joinedGroups?.some(g => g.id === group.id);

    if (isOwned) {
        return `
        <button class="action-btn primary open-owned" data-group-id="${group.id}">
            <span class="action-icon">💬</span>
            Открыть
        </button>
    `;
    } else if (isJoined) {
        return `
        <button class="action-btn primary open-joined" data-group-id="${group.id}">
            <span class="action-icon">💬</span>
            Войти
        </button>
        <button class="action-btn secondary leave-from-search" data-group-id="${group.id}">
            <span class="action-icon">🚪</span>
            Покинуть
        </button>
    `;
    } else {
        return `
        <button class="action-btn primary join-from-search" data-group-id="${group.id}" data-topic="${group.topic}">
            <span class="action-icon">➕</span>
            Присоединиться
        </button>
        <button class="action-btn secondary info-from-search" data-group-id="${group.id}">
            <span class="action-icon">ℹ️</span>
            Инфо
        </button>
    `;
    }
}
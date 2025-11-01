/**
 * Шаблоны для компонента RemoteControl
 * @module components/remote-control/template
 * @version 1.0.0
 * @author Your Name
 * @description HTML-шаблоны компонента удалённого управления с поддержкой частичного рендеринга
 */

/**
 * Основной шаблон компонента RemoteControl
 * @function defaultTemplate
 * @param {Object} params - Параметры рендеринга
 * @param {Object} params.state - Состояние компонента
 * @param {string} [params.state.mode='viewer'] - Режим: 'controller' или 'viewer'
 * @param {string|null} [params.state.targetPeer=null] - ID удалённого пира
 * @param {boolean} [params.state.isConnected=false] - Состояние подключения
 * @param {Object} [params.state.cursorPosition={x:0,y:0}] - Позиция курсора
 * @returns {string} HTML строка
 */
export function defaultTemplate({ state = {} }) {
    const { mode = 'viewer', isConnected = false } = state;
    return `
    <div class="remote-control">
      <div class="control-header">
        <h3 class="control-title">
          ${mode === 'controller' ? 'Управление экраном' : 'Удалённый экран'}
        </h3>
        <div class="connection-status ${isConnected ? 'connected' : 'disconnected'}">
          <span class="status-dot"></span>
          <span class="status-text">${isConnected ? 'Подключено' : 'Не подключено'}</span>
        </div>
      </div>
      <div id="remote-screen" class="remote-screen">
        ${mode === 'viewer' ? '<div id="remote-cursor" class="remote-cursor">🖱️</div>' : ''}
      </div>
    </div>
  `;
}

/**
 * Рендер курсора удалённого управления
 * @function renderCursor
 * @param {Object} params - Параметры рендеринга
 * @param {Object} params.state - Состояние компонента
 * @param {Object} params.state.cursorPosition - Позиция курсора {x, y}
 * @returns {string} HTML строка
 */
export function renderCursor({ state = {} }) {
    const { x = 0, y = 0 } = state.cursorPosition || {};
    return `<div class="remote-cursor" style="left:${x}px;top:${y}px;">🖱️</div>`;
}

/**
 * Визуальный эффект клика
 * @function renderClickEffect
 * @param {Object} params - Параметры рендеринга
 * @param {Object} params.state - Состояние с координатами
 * @param {number} params.state.x - X-координата клика
 * @param {number} params.state.y - Y-координата клика
 * @returns {string} HTML строка
 */
export function renderClickEffect({ state = {} }) {
    const { x = 0, y = 0 } = state;
    return `<div class="click-effect" style="left:${x}px;top:${y}px;"></div>`;
}
// /10/public/components/screen-share-manager/template/index.mjs
export function renderStatus({ state }) {
    if (state.isSharing) {
        return `<div class="status active">Вы транслируете экран</div>`;
    } else if (state.activeSession) {
        return `<div class="status receiving">Получение экрана от пира</div>`;
    }
    return `<div class="status idle">Готов к трансляции</div>`;
}

export function renderPeerList({ state }) {
    if (!state.connectedPeers.length) {
        return `<p class="empty">Нет подключённых пиров</p>`;
    }
    return `
    <ul class="peer-list">
      ${state.connectedPeers.map(peer => `
        <li class="peer-item" data-peer-id="${peer.id}">
          <span>${peer.name || peer.id.substring(0, 8)}...</span>
          <button class="btn-share" data-peer-id="${peer.id}">Транслировать</button>
        </li>
      `).join('')}
    </ul>
  `;
}

export default function defaultTemplate({ state }) {
    return `
    <div class="screen-share-manager">
      <h2>Удалённое управление экраном</h2>
      <div id="share-status">${renderStatus({ state })}</div>
      <div id="peer-list">${renderPeerList({ state })}</div>
      <video id="remote-screen" autoplay playsinline muted></video>
    </div>
  `;
}
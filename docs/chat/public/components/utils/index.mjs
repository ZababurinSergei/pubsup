import { sha256 } from 'https://cdn.jsdelivr.net/npm/js-sha256@0.9.0/+esm';

/**
 * Генерирует читаемое имя из Peer ID
 * @param {string} peerId - ID пира
 * @returns {string} Имя пользователя
 */
export function generatePeerName(peerId) {
    if (!peerId) return 'Неизвестный';

    // Берем первые 6 и последние 4 символа ID
    const prefix = peerId.substring(0, 4);
    const suffix = peerId.substring(peerId.length - 4);
    return `${prefix}_${suffix}`;
}

// Вспомогательная функция для генерации детерминированного ID
export function generateMessageId(text, timestamp) {
    // Убеждаемся, что timestamp — число (мс)
    const ts = typeof timestamp === 'number' ? timestamp : Date.now();
    const input = `${text}|${ts}`;
    return sha256(input).substring(0, 16); // 16-символьный хеш для компактности
}

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
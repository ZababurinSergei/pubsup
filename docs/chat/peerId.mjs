import path from "path";
import process from "node:process";
import {privateKeyFromProtobuf, privateKeyToProtobuf} from "@libp2p/crypto/keys";
import fs from "node:fs";

const PRIVATE_KEY_PATH = path.join(process.cwd(), 'private-key.proto');

/**
 * Сохраняет приватный ключ на диск
 * @param {Uint8Array} privateKey - Приватный ключ в бинарном формате
 * @returns {Promise<boolean>} - Успешно ли сохранен ключ
 */
async function savePrivateKey(privateKey) {
    try {
        // Конвертируем приватный ключ в protobuf формат
        const privateKeyProto = privateKeyToProtobuf(privateKey);

        // Сохраняем на диск
        fs.writeFileSync(PRIVATE_KEY_PATH, privateKeyProto);
        console.log('Приватный ключ успешно сохранен:', PRIVATE_KEY_PATH);
        return true;
    } catch (error) {
        console.error('Ошибка при сохранении приватного ключа:', error);
        return false;
    }
}

/**
 * Читает приватный ключ с диска
 * @returns {Promise<Uint8Array|null>} - Приватный ключ или null если ошибка
 */
async function readPrivateKey() {
    try {
        // Проверяем существует ли файл
        if (!fs.existsSync(PRIVATE_KEY_PATH)) {
            console.log('Файл приватного ключа не найден:', PRIVATE_KEY_PATH);
            return null;
        }

        // Читаем файл
        const buffer = fs.readFileSync(PRIVATE_KEY_PATH);

        // Конвертируем из protobuf обратно в приватный ключ
        const privateKey = privateKeyFromProtobuf(buffer);
        console.log('Приватный ключ успешно загружен с диска');
        return privateKey;
    } catch (error) {
        console.error('Ошибка при чтении приватного ключа:', error);
        return null;
    }
}

/**
 * Генерирует и сохраняет новый приватный ключ, если его нет
 * @returns {Promise<Uint8Array>} - Существующий или новый приватный ключ
 */
async function getOrCreatePrivateKey() {
    // Пытаемся прочитать существующий ключ
    let privateKey = await readPrivateKey();

    // Если ключа нет, генерируем новый и сохраняем
    if (!privateKey) {
        console.log('Генерация нового приватного ключа...');
        const {generateKeyPair} = await import('@libp2p/crypto/keys');
        privateKey = await generateKeyPair('Ed25519');

        // Сохраняем новый ключ
        await savePrivateKey(privateKey);
    }

    return privateKey;
}

export default async () => {
    return  await getOrCreatePrivateKey();
}
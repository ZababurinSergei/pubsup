/* eslint-disable no-console */
import express from "express"
import compression from "compression"
import cors from "cors"
import path from "path"
import process from "node:process"
import * as dotenv from "dotenv"

const __dirname = process.cwd();

dotenv.config();

// const peerId = await peerData()
const RENDER_EXTERNAL_HOSTNAME = process.env.RENDER_EXTERNAL_HOSTNAME ? process.env.RENDER_EXTERNAL_HOSTNAME: 'localhost'

const PORT = process.env.PORT
    ? process.env.PORT
    : 6832;

let app = express();
app.use(compression());
app.use(express.json());
app.use(await cors({ credentials: true }));

app.use(express.static('public'))

app.get('/{*splat}', async (req, res) => {
    console.log('@@@@@@@@@@@@@@@@@@@')
    res.status(200).sendFile(path.join(`${__dirname}/public`, '/index.html'));
})


async function cleanup() {
    console.log('Очистка данных сервера...');


    console.log('Очистка завершена');
}

// Обработчики событий завершения работы
process.on('SIGINT', async () => {
    console.log('\nПолучен SIGINT (Ctrl+C)');
    await cleanup();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Получен SIGTERM');
    await cleanup();
    process.exit(0);
});

process.on('beforeExit', async () => {
    console.log('Процесс завершает работу (beforeExit)');
    await cleanup();
});

process.on('uncaughtException', async (error) => {
    console.error('Необработанное исключение:', error);
    await cleanup();
    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
    console.error('Необработанный промис:', promise, 'причина:', reason);
    await cleanup();
    process.exit(1);
});

app.listen(PORT, RENDER_EXTERNAL_HOSTNAME, () => {
    console.log('pid: ', process.pid);
    console.log(`Server running at http://localhost:${PORT}/`);
})

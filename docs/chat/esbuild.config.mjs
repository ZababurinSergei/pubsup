import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔨 Начинаем сборку с предобработкой путей...');

// Читаем исходный файл
const inputFile = resolve(__dirname, 'public/index.mjs');
const outputFile = resolve(__dirname, 'public/index.build.mjs');

const originalContent = readFileSync(inputFile, 'utf8');

// Заменяем все абсолютные пути на относительные
const processedContent = originalContent.replace(
    /import\s+['"](\/[^'"]*\.mjs)['"]/g,
    (match, path) => {
        const relativePath = `.${path}`;
        console.log(`🔄 ${path} -> ${relativePath}`);
        return `import '${relativePath}'`;
    }
);

// Создаем временный файл
const tempFile = resolve(__dirname, 'public/index-temp.mjs');
writeFileSync(tempFile, processedContent, 'utf8');

console.log('📝 Создан временный файл');

// Конфигурация esbuild
const config = {
    entryPoints: [tempFile],
    bundle: true,
    outfile: outputFile,
    platform: 'browser',
    format: 'esm',
    target: 'es2020',
    minify: false,
    sourcemap: true,
    loader: {
        '.css': 'text',
        '.mjs': 'js'
    }
};

try {
    const result = await esbuild.build(config);
    console.log('✅ Сборка завершена успешно!');
    console.log(`📦 Файл создан: ${outputFile}`);

    // Очищаем временный файл
    writeFileSync(tempFile, '// Temporary file - can be deleted\n');
    console.log('🗑️ Временный файл очищен');

} catch (error) {
    console.error('❌ Ошибка сборки:', error);
    process.exit(1);
}
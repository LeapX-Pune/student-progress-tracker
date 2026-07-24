import { build } from 'esbuild';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');
const publicDir = resolve(rootDir, 'public');
const srcDir = resolve(rootDir, 'src');

function copyAsset(src, dest) {
    if (existsSync(src)) {
        copyFileSync(src, dest);
        console.log(`Copied ${src} -> ${dest}`);
    } else {
        console.warn(`Warning: ${src} not found, skipping`);
    }
}

// Start JSON Server mock API
const mockApi = spawn(
    'npx',
    [
        'json-server',
        '--watch',
        'mock-api/db.json',
        '--port',
        '3001',
        '--routes',
        'mock-api/routes.json',
    ],
    { cwd: rootDir, stdio: 'inherit', shell: true }
);

// Ensure public dir exists
if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });

// Copy assets needed by index.html
copyAsset(resolve(srcDir, 'styles', 'style.css'), resolve(publicDir, 'style.css'));
copyAsset(resolve(srcDir, 'pages', 'script.js'), resolve(publicDir, 'script.js'));

// esbuild watch mode
const ctx = await build({
    entryPoints: ['src/main.js'],
    bundle: true,
    outfile: 'public/main.js',
    format: 'esm',
    target: 'es2022',
    sourcemap: 'inline',
    splitting: false,
    outdir: 'public',
    publicPath: '/',
    loader: {
        '.css': 'css',
        '.svg': 'dataurl',
        '.png': 'file',
        '.jpg': 'file',
        '.woff': 'file',
        '.woff2': 'file',
    },
    define: {
        'import.meta.env.DEV': 'true',
        'import.meta.env.PROD': 'false',
        'import.meta.env.VITE_API_URL': '"http://localhost:3001/api"',
    },
    watch: {
        onRebuild(error) {
            if (error) console.error('Rebuild failed:', error);
            else console.log('Rebuild complete');
        },
    },
});

await ctx.watch();

const staticServer = spawn('npx', ['serve', 'public', '-p', '4173', '--no-clipboard'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true,
});

console.log('Dev server running at http://localhost:4173');
console.log('Mock API at http://localhost:3001/api');

process.on('SIGINT', () => {
    mockApi.kill();
    staticServer.kill();
    ctx.rebuild().then(() => ctx.dispose());
    process.exit(0);
});

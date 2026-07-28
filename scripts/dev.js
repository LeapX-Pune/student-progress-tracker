import { context } from 'esbuild';
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

// Copy standalone source files referenced by index.html for dev server
copyFileSync(resolve(srcDir, 'styles', 'style.css'), resolve(publicDir, 'style.css'));

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

// Copy assets needed by standalone HTML pages
copyAsset(resolve(srcDir, 'dashboard', 'dashboard.css'), resolve(publicDir, 'dashboard.css'));
copyAsset(resolve(srcDir, 'dashboard', 'dashboard.js'), resolve(publicDir, 'dashboard.js'));

// esbuild watch mode
const ctx = await context({
    entryPoints: ['src/main.js'],
    bundle: true,
    outfile: 'public/main.js',
    format: 'esm',
    target: 'es2022',
    sourcemap: 'inline',
    splitting: false,
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
        'import.meta.env.VITE_API_BASE_URL': '"http://localhost:3001/api"',
        'import.meta.env.VITE_APP_NAME': '"Student Progress Tracker"',
        'import.meta.env.VITE_APP_VERSION': '"0.1.0"',
        'import.meta.env.VITE_APP_ENV': '"development"',
        'import.meta.env.VITE_API_TIMEOUT': '10000',
        'import.meta.env.VITE_AUTH_TOKEN_KEY': '"student_tracker_auth"',
        'import.meta.env.VITE_AUTH_REDIRECT_KEY': '"student_tracker_redirect"',
        'import.meta.env.VITE_AUTH_REMEMBER_DAYS': '30',
        'import.meta.env.VITE_ENABLE_MOCK_API': '"true"',
        'import.meta.env.VITE_API_MOCK_ENABLED': '"true"',
        'import.meta.env.VITE_ENABLE_PWA': 'false',
        'import.meta.env.VITE_ENABLE_ANALYTICS': 'false',
        'import.meta.env.VITE_ENABLE_NOTIFICATIONS': 'true',
        'import.meta.env.VITE_CHART_ANIMATION_DURATION': '750',
        'import.meta.env.VITE_CHART_RESPONSIVE': 'true',
        'import.meta.env.VITE_SESSION_TIMEOUT_MINUTES': '60',
        'import.meta.env.VITE_CACHE_TTL_SECONDS': '300',
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

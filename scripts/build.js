import { build } from 'esbuild';
import { copyFileSync, mkdirSync, rmSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');
const distDir = resolve(rootDir, 'dist');
const publicDir = resolve(rootDir, 'public');

// Clean dist
if (existsSync(distDir)) rmSync(distDir, { recursive: true });
mkdirSync(distDir, { recursive: true });

// Build with esbuild
await build({
    entryPoints: ['src/main.js'],
    bundle: true,
    format: 'esm',
    target: 'es2022',
    minify: true,
    sourcemap: true,
    splitting: false,
    outdir: distDir,
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
        'import.meta.env.DEV': 'false',
        'import.meta.env.PROD': 'true',
        'import.meta.env.VITE_APP_NAME': '"Student Progress Tracker"',
        'import.meta.env.VITE_APP_VERSION': '"0.1.0"',
        'import.meta.env.VITE_APP_ENV': '"production"',
        'import.meta.env.VITE_API_BASE_URL': '"/api"',
        'import.meta.env.VITE_API_TIMEOUT': '"10000"',
        'import.meta.env.VITE_API_MOCK_ENABLED': '"true"',
        'import.meta.env.VITE_AUTH_TOKEN_KEY': '"student_tracker_auth"',
        'import.meta.env.VITE_AUTH_REDIRECT_KEY': '"student_tracker_redirect"',
        'import.meta.env.VITE_AUTH_REMEMBER_DAYS': '"30"',
        'import.meta.env.VITE_SESSION_TIMEOUT_MINUTES': '"60"',
        'import.meta.env.VITE_ENABLE_MOCK_API': '"true"',
        'import.meta.env.VITE_ENABLE_PWA': '"true"',
        'import.meta.env.VITE_ENABLE_ANALYTICS': '"true"',
        'import.meta.env.VITE_ENABLE_NOTIFICATIONS': '"true"',
        'import.meta.env.VITE_CACHE_TTL_SECONDS': '"3600"',
        'import.meta.env.VITE_CHART_ANIMATION_DURATION': '"750"',
        'import.meta.env.VITE_CHART_RESPONSIVE': '"true"',
    },
    treeShaking: true,
    legalComments: 'none',
});

console.log('Build complete');
console.log(`Output: ${distDir}`);

// Copy static assets
function copyDir(src, dest) {
    mkdirSync(dest, { recursive: true });
    for (const file of readdirSync(src)) {
        const srcFile = resolve(src, file);
        const destFile = resolve(dest, file);
        if (statSync(srcFile).isDirectory()) {
            copyDir(srcFile, destFile);
        } else {
            copyFileSync(srcFile, destFile);
        }
    }
}

copyFileSync(resolve(publicDir, 'index.html'), resolve(distDir, 'index.html'));

if (existsSync(resolve(publicDir, 'assets'))) {
    copyDir(resolve(publicDir, 'assets'), resolve(distDir, 'assets'));
}

// Copy standalone source files referenced by index.html
const srcDir = resolve(rootDir, 'src');
copyFileSync(resolve(srcDir, 'styles', 'style.css'), resolve(distDir, 'style.css'));
copyFileSync(resolve(srcDir, 'pages', 'script.js'), resolve(distDir, 'script.js'));

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
        'import.meta.env.VITE_API_BASE_URL': '"/api"',
        'import.meta.env.VITE_ENABLE_MOCK_API': '"true"',
        'import.meta.env.VITE_API_MOCK_ENABLED': '"true"',
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

// Copy auth assets (SVG, images) from src/assets to dist/assets
const srcDir = resolve(rootDir, 'src');
if (existsSync(resolve(srcDir, 'assets'))) {
    copyDir(resolve(srcDir, 'assets'), resolve(distDir, 'assets'));
}

// Copy standalone source files referenced by index.html
copyFileSync(resolve(srcDir, 'styles', 'style.css'), resolve(distDir, 'style.css'));
if (existsSync(resolve(publicDir, 'script.js'))) {
    copyFileSync(resolve(publicDir, 'script.js'), resolve(distDir, 'script.js'));
}

// Copy standalone JS files from public root
if (existsSync(resolve(publicDir, 'attendance.js'))) {
    copyFileSync(resolve(publicDir, 'attendance.js'), resolve(distDir, 'attendance.js'));
}

// Copy deployment config (SPA fallback, redirects)
if (existsSync(resolve(publicDir, '_redirects'))) {
    copyFileSync(resolve(publicDir, '_redirects'), resolve(distDir, '_redirects'));
}

// Copy standalone HTML pages
copyFileSync(resolve(publicDir, 'dashboard.html'), resolve(distDir, 'dashboard.html'));
if (existsSync(resolve(publicDir, 'course-progress.html'))) {
    copyFileSync(
        resolve(publicDir, 'course-progress.html'),
        resolve(distDir, 'course-progress.html')
    );
}
if (existsSync(resolve(publicDir, 'grades.html'))) {
    copyFileSync(resolve(publicDir, 'grades.html'), resolve(distDir, 'grades.html'));
}

// Copy dashboard assets (CSS, JS) — not bundled through esbuild
copyFileSync(resolve(srcDir, 'dashboard', 'dashboard.css'), resolve(distDir, 'dashboard.css'));
copyFileSync(resolve(srcDir, 'dashboard', 'dashboard.js'), resolve(distDir, 'dashboard.js'));

// GitHub Pages SPA fallback: serve index.html for 404s
if (existsSync(resolve(publicDir, '404.html'))) {
    copyFileSync(resolve(publicDir, '404.html'), resolve(distDir, '404.html'));
}

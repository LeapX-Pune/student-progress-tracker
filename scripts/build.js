import { build } from 'esbuild';
import { copyFileSync, mkdirSync, rmSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { gzipSync } from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');
const distDir = resolve(rootDir, 'dist');
const publicDir = resolve(rootDir, 'public');

const BUNDLE_LIMIT_KB = 100;

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
        'import.meta.env.VITE_API_URL': '"https://api.example.com/api"',
        'import.meta.env.VITE_ENABLE_MOCK_API': '"false"',
        'import.meta.env.VITE_API_MOCK_ENABLED': '"false"',
    },
    treeShaking: true,
    legalComments: 'none',
});

console.log('Build complete');
console.log(`Output: ${distDir}`);

// Bundle size check
const mainJsPath = resolve(distDir, 'main.js');
if (existsSync(mainJsPath)) {
    const content = await import('fs').then(m => m.readFileSync(mainJsPath));
    const sizeKb = content.length / 1024;
    const gzippedKb = gzipSync(content).length / 1024;
    console.log(`  main.js        ${sizeKb.toFixed(1)} KB (${gzippedKb.toFixed(1)} KB gzipped)`);

    const cssFiles = readdirSync(distDir).filter(f => f.endsWith('.css'));
    for (const css of cssFiles) {
        const cssContent = await import('fs').then(m => m.readFileSync(resolve(distDir, css)));
        const cssSize = cssContent.length / 1024;
        const cssGzip = gzipSync(cssContent).length / 1024;
        console.log(
            `  ${css.padEnd(15)} ${cssSize.toFixed(1)} KB (${cssGzip.toFixed(1)} KB gzipped)`
        );
    }

    if (gzippedKb > BUNDLE_LIMIT_KB) {
        console.error(
            `WARNING: Bundle size ${gzippedKb.toFixed(1)} KB exceeds limit of ${BUNDLE_LIMIT_KB} KB`
        );
    } else {
        console.log(
            `Bundle size ${gzippedKb.toFixed(1)} KB gzipped — within limit of ${BUNDLE_LIMIT_KB} KB`
        );
    }
}

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

// Copy standalone JS files from public root
if (existsSync(resolve(publicDir, 'attendance.js'))) {
    copyFileSync(resolve(publicDir, 'attendance.js'), resolve(distDir, 'attendance.js'));
}

// Copy deployment config (SPA fallback, redirects)
if (existsSync(resolve(publicDir, '_redirects'))) {
    copyFileSync(resolve(publicDir, '_redirects'), resolve(distDir, '_redirects'));
}

// Copy assets for standalone HTML pages
copyFileSync(resolve(publicDir, 'dashboard.html'), resolve(distDir, 'dashboard.html'));
copyFileSync(resolve(srcDir, 'dashboard', 'dashboard.css'), resolve(distDir, 'dashboard.css'));
copyFileSync(resolve(srcDir, 'dashboard', 'dashboard.js'), resolve(distDir, 'dashboard.js'));

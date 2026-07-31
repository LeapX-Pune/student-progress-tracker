import { build } from 'esbuild';
import {
    copyFileSync,
    mkdirSync,
    rmSync,
    existsSync,
    readdirSync,
    statSync,
    writeFileSync,
} from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { gzipSync } from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');
const distDir = resolve(rootDir, 'dist');
const publicDir = resolve(rootDir, 'public');

// Parse CLI arguments
const baseFlag = '--base';
const envFlag = '--env';
const baseIdx = process.argv.indexOf(baseFlag);
const envIdx = process.argv.indexOf(envFlag);
const base = baseIdx !== -1 ? process.argv[baseIdx + 1] : '/';
const env = envIdx !== -1 ? process.argv[envIdx + 1] : 'production';

const envDefines = {
    development: {
        'import.meta.env.DEV': 'true',
        'import.meta.env.PROD': 'false',
        'import.meta.env.VITE_API_URL': '"http://localhost:3001/api"',
        'import.meta.env.VITE_API_BASE_URL': '"http://localhost:3001/api"',
        'import.meta.env.VITE_ENABLE_MOCK_API': '"true"',
        'import.meta.env.VITE_API_MOCK_ENABLED': '"true"',
        'import.meta.env.VITE_APP_ENV': '"development"',
        'import.meta.env.VITE_ENABLE_ANALYTICS': '"false"',
    },
    staging: {
        'import.meta.env.DEV': 'false',
        'import.meta.env.PROD': 'true',
        'import.meta.env.VITE_API_URL': '"https://staging-api.example.com/api"',
        'import.meta.env.VITE_API_BASE_URL': '"https://staging-api.example.com/api"',
        'import.meta.env.VITE_ENABLE_MOCK_API': '"false"',
        'import.meta.env.VITE_API_MOCK_ENABLED': '"false"',
        'import.meta.env.VITE_APP_ENV': '"staging"',
        'import.meta.env.VITE_ENABLE_ANALYTICS': '"true"',
    },
    production: {
        'import.meta.env.DEV': 'false',
        'import.meta.env.PROD': 'true',
        'import.meta.env.VITE_API_URL': '"https://api.example.com/api"',
        'import.meta.env.VITE_API_BASE_URL': '"https://api.example.com/api"',
        'import.meta.env.VITE_ENABLE_MOCK_API': '"false"',
        'import.meta.env.VITE_API_MOCK_ENABLED': '"false"',
        'import.meta.env.VITE_APP_ENV': '"production"',
        'import.meta.env.VITE_ENABLE_ANALYTICS': '"true"',
    },
};

const defines = envDefines[env] || envDefines.production;
const BUNDLE_LIMIT_KB = 150;

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
    publicPath: base,
    loader: {
        '.css': 'css',
        '.svg': 'dataurl',
        '.png': 'file',
        '.jpg': 'file',
        '.woff': 'file',
        '.woff2': 'file',
    },
    define: {
        ...defines,
        'import.meta.env.VITE_APP_NAME': '"Student Progress Tracker"',
        'import.meta.env.VITE_APP_VERSION': '"0.1.0"',
        'import.meta.env.VITE_API_TIMEOUT': '10000',
        'import.meta.env.VITE_AUTH_TOKEN_KEY': '"student_tracker_auth"',
        'import.meta.env.VITE_AUTH_REDIRECT_KEY': '"student_tracker_redirect"',
        'import.meta.env.VITE_AUTH_REMEMBER_DAYS': '30',
        'import.meta.env.VITE_ENABLE_PWA': 'false',
        'import.meta.env.VITE_ENABLE_NOTIFICATIONS': 'true',
        'import.meta.env.VITE_SESSION_TIMEOUT_MINUTES': '60',
        'import.meta.env.VITE_CACHE_TTL_SECONDS': '300',
        'import.meta.env.VITE_CHART_ANIMATION_DURATION': '750',
        'import.meta.env.VITE_CHART_RESPONSIVE': 'true',
    },
    treeShaking: true,
    legalComments: 'none',
});

console.log(`Build complete (env: ${env}, base: ${base})`);
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
if (existsSync(resolve(publicDir, 'overview.js'))) {
    copyFileSync(resolve(publicDir, 'overview.js'), resolve(distDir, 'overview.js'));
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

// Copy index.html as 404.html for SPA fallback on static hosts (GitHub Pages, etc.)
const indexHtml = resolve(distDir, 'index.html');
if (existsSync(indexHtml)) {
    copyFileSync(indexHtml, resolve(distDir, '404.html'));
    console.log('Created 404.html for SPA fallback');
}

// Write .nojekyll for GitHub Pages (disables Jekyll processing)
writeFileSync(resolve(distDir, '.nojekyll'), '');
console.log('Created .nojekyll');

// GitHub Pages SPA fallback: serve index.html for 404s
if (existsSync(resolve(publicDir, '404.html'))) {
    copyFileSync(resolve(publicDir, '404.html'), resolve(distDir, '404.html'));
}

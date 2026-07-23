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
    'import.meta.env.VITE_API_URL': '"https://api.example.com/api"',
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

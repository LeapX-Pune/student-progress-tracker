import { build } from 'esbuild';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

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
    '.css': 'text',
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
console.log('Dev server running at http://localhost:3000');
console.log('Mock API at http://localhost:3001/api');

process.on('SIGINT', () => {
  mockApi.kill();
  ctx.rebuild().then(() => ctx.dispose());
  process.exit(0);
});

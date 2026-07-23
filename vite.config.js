import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => ({
  root: '.',
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },
    chunkSizeWarningLimit: 100,
  },
  server: {
    port: 3000,
    open: true,
  },
  plugins: mode === 'analyze' ? [
    visualizer({
      filename: 'dist/bundle-stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ] : [],
  define: {
    __APP_ENV__: JSON.stringify(mode),
  },
}))

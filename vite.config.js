import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        tasks: resolve(__dirname, 'pages/tasks.html'),
        gardenMap: resolve(__dirname, 'pages/garden-map.html'),
        knowledge: resolve(__dirname, 'pages/knowledge.html'),
        community: resolve(__dirname, 'pages/community.html'),
        resources: resolve(__dirname, 'pages/resources.html'),
        login: resolve(__dirname, 'pages/login.html'),
        profile: resolve(__dirname, 'pages/profile.html')
      },
      output: {
        // Chunking strategy
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage', 'firebase/functions'],
          utils: ['./src/scripts/utils/helpers.js', './src/scripts/utils/modal.js'],
          vendor: ['./src/firebase/config.js', './src/firebase/auth.js']
        }
      }
    },
    // CSS code splitting
    cssCodeSplit: true,
    // Source maps in development
    sourcemap: true,
    // Minification in production
    minify: 'terser'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'assets'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/scripts/utils'),
      '@features': resolve(__dirname, 'src/scripts/features'),
      '@firebase': resolve(__dirname, 'src/firebase')
    }
  },
  plugins: [
    // Add bundle visualization in analyze mode
    process.env.ANALYZE && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true
    })
  ],
  // Environment variable configuration
  define: {
    'process.env': process.env
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage']
  },
  // Dev server configuration
  server: {
    port: 3000,
    open: true,
    cors: true
  }
});

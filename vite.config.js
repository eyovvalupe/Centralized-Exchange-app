import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViteCompression from 'vite-plugin-compression'
import AutoImport from 'unplugin-auto-import/vite'
import eslintPlugin from 'vite-plugin-eslint'
import eslint from 'vite-plugin-eslint'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  plugins: [
    // eslint(),
    vue(),
    ViteCompression({
      algorithm: 'gzip',
      threshold: 10240,
      minRatio: 0.8,
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'vuex', 'vue-i18n', '@vueuse/core'],
    }),
    // eslintPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // 配置 @ 指向 src 目录
    },
  },
  server: {
    port: 3000,
    hot: true,
    proxy: {
      '/api': {
        target: 'https://api.sungame.shop',
        changeOrigin: true,
        logLevel: 'debug',
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViteCompression from 'vite-plugin-compression'
import AutoImport from 'unplugin-auto-import/vite'
import eslintPlugin from 'vite-plugin-eslint'
import eslint from 'vite-plugin-eslint'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  plugins: [
    // eslint(),
    // eslintPlugin(),
    vue(),
    ViteCompression({
      algorithm: 'gzip',
      threshold: 10240,
      minRatio: 0.8,
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'vuex', 'vue-i18n', '@vueuse/core'],
    }),
    VitePWA({
      registerType: 'autoUpdate', // 自动更新
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'], // 需要缓存的静态资源
      manifest: {
        name: 'Lorna', // 应用名称
        short_name: 'Lorna', // 短名称
        description: 'Lorna', // 描述
        theme_color: '#0E0F18', // 主题颜色
        icons: [
          {
            src: 'logo_192x192', // 图标路径
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'logo_512x512', // 图标路径
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'], // 缓存文件类型
        runtimeCaching: [
          {
            urlPattern: /\.(js|css|json|html)$/i, // 匹配静态资源
            handler: 'CacheFirst', // 优先从缓存获取
            options: {
              cacheName: 'static-assets-cache',
              expiration: {
                maxEntries: 100, // 最大缓存条目数
                maxAgeSeconds: 60 * 60 * 24 * 7, // 缓存 30 天
              },
            },
          },
          {
            urlPattern: /.*/i, // 匹配所有其他请求
            handler: 'NetworkFirst', // 优先从网络获取
            options: {
              cacheName: 'fallback-cache',
              networkTimeoutSeconds: 30, // 网络请求超时时间
            },
          },
        ],
      },
    }),
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

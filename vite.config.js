import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViteCompression from 'vite-plugin-compression'
import AutoImport from 'unplugin-auto-import/vite'
import eslintPlugin from 'vite-plugin-eslint'
import eslint from 'vite-plugin-eslint'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa';
import { VERSION } from './src/config'

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
        background_color: '#0E0F18',
        icons: [
          {
            src: 'logo_192x192.png', // 图标路径
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'logo_512x512.png', // 图标路径
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        "screenshots": [
          {
            "src": "screenshots/desktop.png", // 桌面设备截图路径
            "sizes": "1920x1080", // 截图尺寸
            "type": "image/png", // 截图格式
            "form_factor": "wide" // 适用于桌面设备
          },
          {
            "src": "screenshots/mobile.png", // 移动设备截图路径
            "sizes": "1080x1920", // 截图尺寸
            "type": "image/png", // 截图格式
            "form_factor": "narrow" // 适用于移动设备
          }
        ]
      },
      // workbox: false, // 完全禁用 Service Worker
      workbox: {
        globPatterns: [], // 缓存文件类型
        runtimeCaching: [
          {
            urlPattern: /.*/, // 匹配所有请求
            handler: 'NetworkOnly', // 强制从网络获取
          },
        ],
      },
    }),
    {
      name: 'html-transform', // 插件名称
      transformIndexHtml(html) {
        return html.replace(
          '</body>',
          `<script>
            console.log("${VERSION}  ${new Date()}");
          </script></body>`
        );
      }
    },
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

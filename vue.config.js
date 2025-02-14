const { defineConfig } = require('@vue/cli-service')
const CompressionPlugin = require('compression-webpack-plugin')
const { RetryChunkLoadPlugin } = require('webpack-retry-chunk-load-plugin')
const { default: AutoImport } = require('unplugin-auto-import/webpack')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
        threshold: 10240, // 文件大小大于等于 10kb 时启用压缩
        minRatio: 0.8, // 压缩比例达到 0.8 时启用压缩
      }),
      new RetryChunkLoadPlugin({
        retryDelay: 1000, // 重试延迟时间（毫秒）
        maxRetries: 3, // 最大重试次数
        lastResortScript: 'fallback.js', // 备用脚本，当重试次数用尽时加载
      }),
      // new BundleAnalyzerPlugin({ // 包体积分析
      //   analyzerMode: 'server',
      //   analyzerHost: '127.0.0.1',
      //   analyzerPort: 8888,
      //   reportFilename: 'report.html',
      //   defaultSizes: 'parsed',
      //   openAnalyzer: true,
      //   generateStatsFile: false,
      //   statsFilename: 'stats.json',
      //   statsOptions: null,
      //   logLevel: 'info'
      // }),
      AutoImport({
        imports: ['vue', 'vue-router', 'vuex', 'vue-i18n', '@vueuse/core'],
        // eslintrc: {
        //   enabled: true,
        //   filepath: './.eslintrc-auto-import.json',
        // },
      }),
    ],
  },
  publicPath: '/',
  transpileDependencies: true,
  productionSourceMap: false,
  lintOnSave: false,
  devServer: {
    port: 3000,
    hot: true, // 开启HMR功能(只能用于开发环境，生产环境不需要)
    client: {
      overlay: false,
    },
    proxy: {
      '/api': {
        // target: 'http://146.70.86.141:8000',
        target: 'https://api.sungame.shop',
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: { '^/api': '' },
      },
    },
  },
  pwa: {
    name: 'Lorna', // 应用名称
    short_name: 'Lorna', // 短名称
    themeColor: '#00a609', // 主题颜色
    backgroundColor: '#0E0F18', // 背景颜色
    appleMobileWebAppCapable: 'yes', // 是否启用 iOS 的 Web App 模式
    appleMobileWebAppStatusBarStyle: 'black', // iOS 状态栏样式
    workboxPluginMode: 'InjectManifest', // 使用自定义 Service Worker
    workboxOptions: {
      swSrc: './public/service-worker.js', // 指定自定义 Service Worker 文件
      // swDest: 'service-worker.js', // 输出的 Service Worker 文件
    },
    // iconPaths: { // 图标路径配置
    //   favicon32: './pwa/logo_192x192.png',
    //   favicon16: './pwa/logo_192x192.png',
    //   appleTouchIcon: './pwa/logo_192x192.png',
    // },
    manifestPath: 'manifest.json', // manifest 文件路径
    manifestOptions: {
      // manifest 文件内容
      name: 'Lorna',
      short_name: 'Lorna',
      start_url: '.',
      display: 'standalone',
      background_color: '#0E0F18',
      theme_color: '#00a609',
      icons: [
        {
          src: './pwa/logo_192x192.png',
          sizes: '72x72',
          type: 'image/png',
        },
        {
          src: './pwa/logo_192x192.png',
          sizes: '96x96',
          type: 'image/png',
        },
        {
          src: './pwa/logo_192x192.png',
          sizes: '128x128',
          type: 'image/png',
        },
        {
          src: './pwa/logo_192x192.png',
          sizes: '144x144',
          type: 'image/png',
        },
        {
          src: './pwa/logo_192x192.png',
          sizes: '152x152',
          type: 'image/png',
        },
        {
          src: './pwa/logo_192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: './pwa/logo_192x192.png',
          sizes: '384x384',
          type: 'image/png',
        },
        {
          src: './pwa/logo_192x192.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  },
})

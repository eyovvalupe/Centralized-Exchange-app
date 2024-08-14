const { defineConfig } = require("@vue/cli-service");
const CompressionPlugin = require("compression-webpack-plugin");
const { RetryChunkLoadPlugin } = require('webpack-retry-chunk-load-plugin');

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        algorithm: "gzip",
        test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
        threshold: 10240, // 文件大小大于等于 10kb 时启用压缩
        minRatio: 0.8, // 压缩比例达到 0.8 时启用压缩
      }),
      new RetryChunkLoadPlugin({
        retryDelay: 1000, // 重试延迟时间（毫秒）
        maxRetries: 3, // 最大重试次数
        lastResortScript: 'fallback.js', // 备用脚本，当重试次数用尽时加载
      })
    ],
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.compilerOptions = options.compilerOptions || {}
        options.compilerOptions.isCustomElement = tag => tag === 'iconpark-icon'
        return options
      })
  },
  publicPath: "/",
  transpileDependencies: true,
  productionSourceMap: false,
  lintOnSave: false,
  devServer: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://62.112.10.184:8302",
        changeOrigin: true,
        logLevel: "debug",
        pathRewrite: { '^/api': '' },
      },
    },
  },
});

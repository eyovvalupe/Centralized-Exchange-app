const { defineConfig } = require("@vue/cli-service");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        algorithm: "gzip",
        test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
        threshold: 10240, // 文件大小大于等于 10kb 时启用压缩
        minRatio: 0.8, // 压缩比例达到 0.8 时启用压缩
      }),
    ],
  },
  publicPath: "/",
  transpileDependencies: true,
  productionSourceMap: false,
  lintOnSave: false,
  devServer: {
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

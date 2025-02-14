import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@vant/touch-emulator'
import 'vant/lib/index.css'
import i18n from './i18'
import lazyPlugin from 'vue3-lazy'
import CryptoIcon from "@/components/CryptoIcon"

const app = createApp(App)
app.config.errorHandler = (err, instance, info) => {
  // 向追踪服务报告错误
  console.error('err', err)
  console.error('info', info)
}

// 全局注册组件
app.component('CryptoIcon', CryptoIcon)

app.use(store).use(router).use(i18n).use(lazyPlugin, {
  // loading: require('@/assets/img-default.svg'), // 图片加载时默认图片
  // error: require('@/assets/img-error.svg')// 图片加载失败时默认图片
}).mount('#app')

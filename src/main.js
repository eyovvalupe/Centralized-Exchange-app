import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@vant/touch-emulator';
import 'vant/lib/index.css';
import i18n from './i18'
// import { initVoice } from "./utils/voice"

const app = createApp(App)
app.use(store).use(router).use(i18n).mount('#app')
// initVoice()

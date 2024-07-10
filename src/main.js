import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css';
// import { initVoice } from "./utils/voice"

const app = createApp(App)
app.use(store).use(router).mount('#app')

// initVoice()

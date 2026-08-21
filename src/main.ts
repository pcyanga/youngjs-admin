import { createApp } from 'vue'
import App from './App.vue'
import pinia from './store'
import router from './router'
import '@/router/guard'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/assets/styles/index.scss'
import '@/assets/styles/transition.scss'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')

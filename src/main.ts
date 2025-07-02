import './assets/styles/main.scss'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './stores'
import 'virtual:svg-icons-register' // 重要：注册SVG图标
import { setupPermissionDirective } from '@/directives/permission'

const app = createApp(App)

// 安装权限指令
setupPermissionDirective(app)

app.use(store)
app.use(router)

app.mount('#app')

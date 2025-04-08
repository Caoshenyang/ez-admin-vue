import './assets/styles/main.scss'

import { createApp } from 'vue'
import App from './App.vue'

// 引入路由
import router from './router'
import store from './stores'
// 登录鉴权
import './router/permission'
import 'virtual:svg-icons-register'

import SvgIcon from './components/icons/EZSvgIcon.vue'

const app = createApp(App)
app.use(router)
app.use(store)

// 全局注册组件
app.component('SvgIcon', SvgIcon)

app.mount('#app')

import './assets/styles/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
// 引入路由
import router from './router'
import store from './stores'
// 登录鉴权
import './router/permission'
// 引入自定义图标组件
import EZSvgIcon from './components/icons/EZSvgIcon.vue'
// 指令注册
import { permission } from './directives/permission'

const app = createApp(App)
app.use(router)
app.use(store)
app.directive('permission', permission)

// 全局注册组件
app.component('EZSvgIcon', EZSvgIcon)

app.mount('#app')

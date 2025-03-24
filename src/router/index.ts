import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import LoginPage from '@/views/login/LoginPage.vue'

export const HOME_PAGE = '/dashboard/workbench'

/** 静态路由，所有用户默认拥有的菜单路由 */
const staticRoutes: Array<RouteRecordRaw> = [
  { path: '/login', name: 'login', component: LoginPage },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: staticRoutes,
})

export default router

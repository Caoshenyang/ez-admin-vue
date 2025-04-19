import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import LoginPage from '@/views/login/LoginPage.vue'
import NotFountPage from '@/views/errors/NotFountPage.vue'
import MyLayout from '@/components/layout/MyLayout.vue'
import WorkbenchPage from '@/views/dashboard/WorkbenchPage.vue'

export const HOME_PAGE = '/dashboard/workbench'
export const HOME_PAGE_NAME = '工作台'

/** 静态路由，所有用户默认拥有的菜单路由 */
const staticRoutes: Array<RouteRecordRaw> = [
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/:pathMatch(.*)*', component: NotFountPage, name: 'NotFound' },
  {
    path: '/',
    name: 'main',
    redirect: HOME_PAGE,
    component: MyLayout,
    children: [
      {
        path: HOME_PAGE,
        name: HOME_PAGE_NAME,
        component: WorkbenchPage,
        meta: {
          title: HOME_PAGE_NAME,
          title_en: 'Workbench',
          keepAlive: false
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: staticRoutes
})

export default router

import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import LoginPage from '@/views/login/LoginPage.vue'
import NotFountPage from '@/views/errors/NotFountPage.vue'
import MyLayout from '@/components/layout/MyLayout.vue'
import WorkbenchPage from '@/views/dashboard/WorkbenchPage.vue'

export const HOME_PAGE = '/dashboard/workbench'

/** 静态路由，所有用户默认拥有的菜单路由 */
const staticRoutes: Array<RouteRecordRaw> = [
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/:pathMatch(.*)*', component: NotFountPage, name: 'NotFound' },
  {
    path: '/',
    name: 'dashboard',
    redirect: HOME_PAGE,
    component: MyLayout,
    children: [
      {
        path: HOME_PAGE,
        name: 'Workbench',
        component: WorkbenchPage,
        meta: {
          title: '工作台',
          title_en: 'Workbench',
          keepAlive: false
        }
      },
      {
        path: '/system',
        name: 'System',
        children: [
          {
            path: 'menu',
            name: 'menu',
            component: () => import('@/views/system/menu/MenuManagementPage.vue'),
            meta: {
              title: '菜单管理'
            }
          },
          {
            path: 'role',
            name: 'role',
            component: () => import('@/views/system/role/RoleManagementPage.vue'),
            meta: {
              title: '角色管理'
            }
          }
        ],
        meta: {
          title: '系统管理'
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

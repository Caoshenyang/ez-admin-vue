import type { MenuTreeVO } from '@/types/auth'
import type { RouteRecordRaw } from 'vue-router'
import MyLayout from '@/components/layout/MyLayout.vue'
import { MenuType } from '@/enums/appEnums'
import { useUserStore } from '@/stores/modules/userStore'

/**
 * 获取组件导入函数
 */
function getComponentImporter(component?: string) {
  if (!component) return undefined

  // 处理动态导入路径
  const normalizedPath = component.startsWith('/') ? component.slice(1) : component

  return () => import(/* @vite-ignore */ `../views/${normalizedPath}`)
}

/**
 * 转换菜单为路由配置
 */
function transformMenuToRoute(menu: MenuTreeVO, parentPath = ''): RouteRecordRaw | null {
  // 忽略按钮类型
  if (menu.menuType === MenuType.BUTTON) return null

  // 处理路径，确保不以/开头且父路径正确拼接
  const path = menu.routePath?.startsWith('/') ? menu.routePath.slice(1) : menu.routePath || ''
  const fullPath = parentPath ? `${parentPath}/${path}` : `/${path}`

  // 初始化 Pinia 缓存（无需等待）
  const userStore = useUserStore()
  userStore.cacheButtons(fullPath, menu)

  // 路由配置基础结构
  const route: RouteRecordRaw = {
    path: fullPath,
    name: menu.routeName || menu.menuId, // 使用菜单ID作为路由name
    component: menu.menuType === MenuType.DIRECTORY ? MyLayout : getComponentImporter(menu.componentPath),
    meta: {
      auth: true, // 默认需要鉴权
      title: menu.menuName,
      icon: menu.menuIcon
    },
    children: []
  }

  // 处理子路由
  if (menu.children?.length) {
    menu.children
      .sort((a, b) => a.menuSort - b.menuSort)
      .forEach((child) => {
        const childRoute = transformMenuToRoute(child, fullPath)
        if (childRoute) route.children?.push(childRoute)
      })

    // 设置重定向到第一个子路由（如果有子路由）
    if (route.children?.length && menu.menuType === MenuType.DIRECTORY) {
      route.redirect = route.children[0].path
    }
  }

  return route
}

/**
 * 生成动态路由
 * @param menuData 菜单数据
 * @returns 动态路由配置
 */
export async function generateDynamicRoutes(menuData: MenuTreeVO[]) {
  // 过滤出顶级菜单（parentId为空或为0）
  const topLevelMenus = menuData.filter((menu) => !menu.parentId || menu.parentId === '0')

  // 按排序权重排序并转换为路由
  return topLevelMenus
    .sort((a, b) => a.menuSort - b.menuSort)
    .map((menu) => transformMenuToRoute(menu))
    .filter((route): route is RouteRecordRaw => route !== null)
}

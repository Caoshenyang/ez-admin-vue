import type { MenuTreeVO } from '@/types/auth'
import type { RouteRecordRaw } from 'vue-router'
import MyLayout from '@/components/layout/MyLayout.vue'

/**
 * 转换菜单项为路由配置
 * @param menu 菜单项
 * @param parentPath 父级路径（用于嵌套路由）
 * @returns 路由配置
 */
function transformMenuToRoute(menu: MenuTreeVO, parentPath = ''): RouteRecordRaw | null {
  // 处理路径，确保不以/开头且父路径正确拼接
  let path = menu.routePath
  if (path.startsWith('/')) {
    path = path.substring(1)
  }

  let componentPath = menu.componentPath
  if (componentPath.startsWith('/')) {
    componentPath = componentPath.substring(1)
  }

  // 完整路径 = 父路径 + 当前路径
  const fullPath = parentPath ? `${parentPath}/${path}` : `/${path}`

  // 如果是菜单类型（页面）
  if (menu.menuType === 2) {
    return {
      path: fullPath,
      name: menu.routeName || menu.menuId,
      component: () => import(/* @vite-ignore */ '../views/' + componentPath),
      meta: {
        title: menu.menuName,
        icon: menu.menuIcon,
        permission: menu.menuPerm,
        keepAlive: false
      }
    }
  }

  // 如果是目录类型（容器）
  if (menu.menuType === 1) {
    const route: RouteRecordRaw = {
      path: fullPath,
      name: menu.routeName || menu.menuId,
      component: MyLayout, // 目录使用布局组件
      meta: {
        title: menu.menuName,
        icon: menu.menuIcon,
        permission: menu.menuPerm
      },
      redirect: '', // 先设置为空，后面处理
      children: []
    }

    // 处理子菜单
    if (menu.children && menu.children.length > 0) {
      menu.children
        .sort((a, b) => a.menuSort - b.menuSort) // 按排序号排序
        .forEach((child) => {
          const childRoute = transformMenuToRoute(child, fullPath)
          if (childRoute) {
            route.children?.push(childRoute)
          }
        })

      // 设置重定向到第一个子路由（如果有子路由）
      if (route.children && route.children.length > 0) {
        route.redirect = route.children[0].path
      }
    }
    return route
  }
  return null
}

/**
 * 生成动态路由
 * @param menuData 菜单数据
 * @returns 动态路由配置
 */
export function generateDynamicRoutes(menuData: MenuTreeVO[]): RouteRecordRaw[] {
  const dynamicRoutes: RouteRecordRaw[] = []

  // 先找出所有顶级菜单（parentId为0的菜单）
  const topLevelMenus = menuData.filter((menu) => menu.parentId === '0')

  // 按排序号排序
  topLevelMenus.sort((a, b) => a.menuSort - b.menuSort)

  // 转换每个顶级菜单及其子菜单
  topLevelMenus.forEach((menu) => {
    const route = transformMenuToRoute(menu)
    if (route) {
      dynamicRoutes.push(route)
    }
  })
  return dynamicRoutes
}

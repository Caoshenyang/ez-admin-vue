import type { MenuTreeVO } from '@/types/auth'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 将菜单转成路由信息
 * 与后端约定好 菜单类型【1 目录 2 菜单 3 按钮】
 * 只有 2 才会生成路由
 * @param menus
 */
export function transformMenusToRoutes(menus: MenuTreeVO[]): RouteRecordRaw[] {
  return menus.flatMap((item): RouteRecordRaw[] => {
    // 没有子级菜单
    if (!item.children || item.children.length === 0) {
      // 菜单类型为2，才生成路由，3 则为按钮，不需要生成路由
      if (item.menuType !== 2) {
        return []
      }
      return [
        {
          path: item.menuPath,
          name: item.menuName.replace(/\s/g, ''),
          component: () =>
            import(/* @vite-ignore */ '../views/' + item.menuPath + '/' + item.component),
          meta: { title: item.menuName },
        },
      ]
    } else {
      return [
        {
          path: item.menuPath || '/', // 如果顶级菜单没有path，可设置为'/'
          name: item.menuName.replace(/\s/g, ''),
          redirect: `${item.children[0].menuPath}`,
          meta: { title: item.menuName },
          children: transformMenusToRoutes(item.children),
        },
      ]
    }
  })
}

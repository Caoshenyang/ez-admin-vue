/**
 * 菜单请求类型
 */
interface BaseMenu {
  menuId?: string
  menuName: string
  menuIcon: string
  menuLabel: string
  parentId: string
  menuSort: number
  menuType: number
  menuPerm: string
  routePath: string
  routeName: string
  componentPath: string
  status: number
}

/** 表单 */
export type MenuForm = BaseMenu
/** 详情 */
export type MenuDetailVO = BaseMenu
/** 查询 */
export interface MenuQuery {
  menuName?: string
  dateRange: []
}

/**  选择菜单数据类型 */
export interface MenuTreeVO {
  menuId: string
  menuName: string
  parentId: string
  children?: MenuTreeVO[]
}

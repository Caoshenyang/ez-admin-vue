/**
 * 菜单基础类型
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
  status?: number
}

/**  选择菜单数据类型 */
export interface MenuTreeVO {
  menuId: string
  menuName: string
  parentId: string
  children?: MenuTreeVO[]
}

// 角色基础类型
export interface BaseRole {
  roleId?: string
  roleName: string
  roleKey: string
  roleSort: number
  status: number
  description: string
}

/** 表单 */
export type RoleForm = BaseRole
/** 详情 */
export type RoleDetailVO = BaseRole
/** 查询列表 */
export interface RoleListVO {
  roleId: string
  roleName: string
  roleKey: string
  roleSort: number
  status: number
  description: string
}

export interface RoleQuery {
  roleName?: string
  dateRange?: []
}

export interface RoleMenuRelation {
  roleId: string
  menuIds: string[]
}

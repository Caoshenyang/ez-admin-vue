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
  roleId: string
  roleName: string
  roleLabel: string
  dataScope: number
  roleSort: number
  status: number
  description: string
}

/** 表单 */
export type RoleForm = BaseRole
/** 详情 */
export type RoleDetailVO = BaseRole
/** 查询列表 */
export type RoleListVO = BaseRole
export interface RoleQuery {
  roleName?: string
  dateRange?: []
}
export interface RoleMenuRelation {
  roleId: string
  menuIds: string[]
}

// 部门基础类型
export interface BaseDept {
  deptId: string
  deptName: string
  deptSort: number
  ancestors: string
  parentId: string
  description: string
  status: number
}

/** 表单 */
export type DeptForm = Partial<BaseDept>
/** 详情 */
export type DeptDetailVO = BaseDept
/** 查询列表 */
export interface DeptTreeVO extends BaseDept {
  children?: DeptTreeVO[]
}

export interface DeptQuery {
  deptName?: string
}

// 部门基础类型
export interface BaseUser {
  userId: string
  deptId: string
  username: string
  password: string
  nickname: string
  email: string
  phoneNumber: string
  gender: number
  avatar: string
  status: number
  description: string
}

/** 表单 */
export interface UserForm extends Partial<BaseUser> {
  roleIds?: string[]
}

/** 查询列表 */
export type UserListVO = Partial<BaseUser>

export interface UserQuey {
  username?: string
}

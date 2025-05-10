// token 信息
export interface TokenInfoVO {
  tokenName: string
  tokenValue: string
}

// 登录参数
export interface LoginDTO {
  username: string
  password: string
}

// 用户信息
export interface UserInfoVO {
  userId: string
  username: string
  nickname: string
  avatar: string
  permissions: string[]
  menus: MenuTreeVO[]
}

/** 路由类型 */
export interface MenuTreeVO {
  menuId: string
  parentId: string
  menuType: 1 | 2 | 3 // 1:目录 2:菜单 3:按钮
  menuName: string
  menuIcon: string
  menuPerm: string
  menuSort: number
  routePath: string
  routeName: string
  componentPath: string
  buttonEvent: string
  buttonStyle: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  status: number
  visible: number
  children?: MenuTreeVO[]
}

export type PermissionType = string | string[]

export interface UserPermission {
  permissions: string[]
}

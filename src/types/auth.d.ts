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
  children?: MenuTreeVO[]
}

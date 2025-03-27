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
  menuId: number
  menuName: string
  menuLabel: string
  menuPerm: string
  parentId: number
  menuType: number
  menuSort: number
  menuIcon: string
  menuPath: string
  component: string
  children?: MenuTreeVO[]
}

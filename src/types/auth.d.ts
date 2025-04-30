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
  menuLabel: string
  menuIcon?: string
  menuPerm?: string
  menuSort: number
  routePath?: string
  routeName?: string
  componentPath?: string
  status: number
  children?: MenuTreeVO[]
}

// 按钮配置类型
export interface ButtonConfig {
  id: string // 按钮ID
  name: string // 按钮名称
  permission: string // 权限标识
  icon?: string // 图标类名
  visible?: boolean // 是否可见
  action?: () => void // 点击动作
}

// 扩展路由meta类型
declare module 'vue-router' {
  interface RouteMeta {
    auth?: boolean // 是否需要鉴权
    buttonKeys?: string[] // 关联的按钮keys
    // 其他自定义meta字段...
  }
}

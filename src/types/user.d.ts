// 用户信息
export interface UserInfoVO {
  userId: string
  username: string
  nickname: string
  avatar: string
  menus: MenuTreeVO[]
  permissions: string[]
}

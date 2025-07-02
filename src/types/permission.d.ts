export type ActionType = 'view' | 'add' | 'edit' | 'delete' | 'export' // 可扩展

// 权限数据类型
export interface Permission {
  id: string
  name: string
  actions?: ActionType[]
}

// 用户权限数据类型
export type UserPermissions = {
  [key: string]: Permission
}

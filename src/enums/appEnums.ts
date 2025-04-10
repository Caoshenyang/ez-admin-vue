// 系统级别枚举

// Menu close width
export enum MenuWidthEnum {
  OPEN = '252px',
  CLOSE = '70px'
}

// 数据范围 【1 仅本人数据权限 2 本部门数据权限 3 本部门及以下数据权限 4 自定义数据权限 5 全部数据权限】
export enum DataScopeEnum {
  '本人' = 1,
  '本部门' = 2,
  '本部门及以下' = 3,
  '自定义' = 4,
  '全部' = 5
}

// 系统状态 【0 禁用 1 启用】
export enum StatusEnum {
  '禁用' = 0,
  '启用' = 1
}

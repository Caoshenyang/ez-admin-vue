// 分页结果类型
export interface PageVO<T> {
  total: number // 总记录数
  pages: number // 总页数
  records: T[] // 当前页数据
}

// 分页请求参数类型
export interface PageQuery<T> {
  pageNum: number // 当前页码
  pageSize: number // 每页记录数
  orderItems?: OrderItem[] // 排序字段
  search?: T // 查询参数
}

// 排序字段类型
export interface OrderItem {
  column: string // 排序字段
  asc: boolean // 是否升序
}

// 分页结果类型
export interface PageVO<T> {
  total: number // 总记录数
  pages: number // 总页数
  records: T[] // 当前页数据
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// =============== 统一结果 类型定义 =============== //
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

export interface Tree {
  [key: string]: string
}

// =============== 操作栏类型定义 =============== //
export interface ActionItem {
  name: string // 名称
  icon?: Component // 图标
  label?: string // 按钮文字
  tooltip?: string // 提示
  type?: '' | 'primary' | 'success' | 'warning' | 'danger' | 'info' // 按钮类型
  sort?: number // 排序
  visible?: boolean | (() => boolean) // 是否显示
  disabled?: boolean | (() => boolean) // 是否禁用
  divided?: boolean // 是否显示分割线
  permission?: string // 权限标识
}

export interface FormItem {
  field: string // 字段名
  label: string // 标签
  component: Component // 组件实例
  props?: Record<string, any> // 组件属性
  advanced?: boolean // 是否高级搜索
  span?: number // 跨列数
  hidden?: boolean | (() => boolean) // 是否隐藏
}

export interface SmartActionBarState {
  showSearch: boolean // 是否显示搜索
  showAdvanced: boolean // 是否显示高级搜索
}

export interface SmartActionBarProps {
  modelValue: SmartActionBarState // 当前状态
  searchParams?: Record<string, any> // 搜索参数
  formConfig?: FormItem[] // 搜索表单配置
  actions?: ActionItem[] // 操作按钮
  maxPrimaryActions?: number // 最大主操作按钮数量
  showToggleButton?: boolean // 是否显示折叠按钮
  rememberState?: boolean // 是否记住状态
  searchDebounce?: number // 搜索防抖时间(ms)
}

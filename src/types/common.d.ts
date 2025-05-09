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

export interface BaseQuery {
  keyword?: string // 关键字
}

// 排序字段类型
export interface OrderItem {
  column: string // 排序字段
  asc: boolean // 是否升序
}

export interface Tree {
  [key: string]: string
}

// =============== 动态表单、表格 类型定义 =============== //
// 列表字段类型定义
export interface TableColumn extends Partial<TableColumnCtx<any>> {
  prop: string
  label: string
  type?: 'selection' | 'index' | 'expand'
  formatter?: (row: any) => string
  component?: string | Component
  width?: number | string
  minWidth?: number | string
  align?: 'left' | 'center' | 'right'
  fixed?: boolean | 'left' | 'right'
  [key: string]: unknown
}

export interface TableProps {
  columns: TableColumn[] // 表格列
  rowKey?: string // 表格行主键
  showSelection?: boolean // 是否显示选择框
  showIndex?: boolean // 是否显示索引
  treeProps?: TreeProps // 是否显示树形结构
}

// form表单字段类型定义
export interface FormField {
  prop: string // 字段名
  label: string // 显示标签
  labelWidth?: string // 标签宽度
  type: string // 字段类型 （input/select/checkbox/radio/switch/...）具体参考 utils/dynamicComponent.ts/componentMap
  defaultValue?: unknown // 默认值
  props?: Record<string, any> // 组件额外属性
  options?: FieldOption[] | (() => Promise<FieldOption[]>) // select/radio/checkbox专用
  hidden?: boolean | (() => boolean) // 是否隐藏
  disabled?: boolean | (() => boolean) // 是否禁用
  rules?: FormItemRule[] // 验证规则
  collapsed?: boolean // 是否默认折叠
  system?: boolean // 是否系统参数
  span?: number // 表单栅格宽度
}

export interface EZFormProps<F> {
  fields: FormField[] // 表单字段
  formData: F // 表单数据
  columns?: number // 表单列数
  labelWidth?: string | number // 表单标签宽度
  submitOnEnter?: boolean // 是否在按下回车键时提交表单
}

// 选项类型
export interface FieldOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface ActionItem {
  name: string // 操作唯一标识
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' // 按钮类型
  icon?: string // 按钮图标
  tooltip?: string // 提示文本
  visible?: boolean // 是否显示
  disabled?: boolean // 是否禁用
  sort?: number // 排序权重
}

export interface SmartActionBarProps {
  queryParams?: FormField[] // 搜索表单配置
  buttons?: ActionItem[] // 操作按钮
  maxPrimaryActions?: number // 最大主操作按钮数量
  debounceTime?: number // 搜索防抖时间(ms)
  persistState?: boolean // 是否记住状态
}

// 动态搜索条件组件类型定义
export type ComponentConfig = {
  placeholder?: string | ((label: string) => string) // 提示文本
  defaultProps: Record<string, any> // 默认属性
}

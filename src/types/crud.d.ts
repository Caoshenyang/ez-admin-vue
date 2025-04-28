import { type FormItemRule, type TableColumnCtx } from 'element-plus'
/* eslint-disable @typescript-eslint/no-explicit-any */
// 组件配置类型 F 表单数据类型 Q 查询数据类型 T 表格数据类型
export interface CrudConfig<F, Q, T> {
  idKey: keyof T // 主键
  name: string // 名称
  // 表单配置
  form: {
    initialData: F // 初始数据
    fields: FormField[] // 表单字段
    rules?: FormItemRule[] // 表单校验规则
  }
  // 表格配置
  table: {
    columns: TableColumn[] // 表格列
    rowKey?: string // 表格行主键
    showSelection?: boolean // 是否显示选择框
    showIndex?: boolean // 是否显示索引
    treeProps?: TreeProps // 是否显示树形结构
  }
  query?: QueryField[] // 查询条件
  apis: {
    list: (query: Q) => Promise<T>
    create: (data: F) => Promise<any>
    update: (data: F) => Promise<any>
    delete: (ids: string[]) => Promise<any>
    [key: string]: any
  }
  hooks?: {
    beforeCreate?: (data: F) => F | Promise<F>
    beforeUpdate?: (data: F) => F | Promise<F>
    afterSubmit?: () => void
  }
}

// form表单字段类型定义
export interface FormField {
  prop: string // 字段名
  label: string // 显示标签
  labelWidth?: string // 标签宽度
  type:
    | 'input'
    | 'textarea'
    | 'number'
    | 'select'
    | 'treeSelect'
    | 'radio'
    | 'checkbox'
    | 'switch'
    | 'date'
    | 'daterange'
    | 'custom' // 基础属性
  defaultValue?: unknown // 默认值
  component?: Component // 自定义组件 custom类型专用
  props?: Record<string, any> // 组件额外属性
  options?: FieldOption[] | (() => Promise<FieldOption[]>) // select/radio/checkbox专用
  hidden?: boolean | (() => boolean) // 是否隐藏
  disabled?: boolean | (() => boolean) // 是否禁用
  rules?: FormItemRule[] // 验证规则
  collapsed?: boolean // 是否默认折叠
  system?: boolean // 是否系统参数
  span?: number // 表单栅格宽度
}

// 列表字段类型定义
export interface TableColumn extends Partial<TableColumnCtx<any>> {
  prop: string
  label: string
  type?: 'selection' | 'index' | 'expand'
  formatter?: (row: any) => string
  component?: string | Component
}

// 查询条件类型定义
export interface QueryField {
  prop: string
  label: string
  component: string | Component
  props?: Record<string, any>
}

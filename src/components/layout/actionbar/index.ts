/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ElInput,
  ElInputNumber,
  ElSelect,
  ElRadioGroup,
  ElCheckboxGroup,
  ElSwitch,
  ElDatePicker,
  type FormItemRule,
  ElTreeSelect
} from 'element-plus'

// 选项类型
export interface FieldOption {
  label: string
  value: string | number
  disabled?: boolean
}

// 类型定义
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

export interface ActionItem {
  name: string // 操作唯一标识
  label: string // 显示文本
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' // 按钮类型
  icon?: Component // 按钮图标
  tooltip?: string // 提示文本
  visible?: boolean // 是否显示
  disabled?: boolean // 是否禁用
  sort?: number // 排序权重
}

export interface SmartActionBarProps {
  filters?: FormField[] // 搜索表单配置
  actions?: ActionItem[] // 操作按钮
  maxPrimaryActions?: number // 最大主操作按钮数量
  debounceTime?: number // 搜索防抖时间(ms)
  persistState?: boolean // 是否记住状态
}

// 动态搜索条件组件类型定义
export type ComponentConfig = {
  placeholder?: string | ((label: string) => string) // 提示文本
  defaultProps: Record<string, any> // 默认属性
}

// 组件映射表
const componentMap = {
  input: ElInput,
  textarea: ElInput,
  number: ElInputNumber,
  select: ElSelect,
  treeSelect: ElTreeSelect,
  radio: ElRadioGroup,
  checkbox: ElCheckboxGroup,
  switch: ElSwitch,
  date: ElDatePicker,
  daterange: ElDatePicker
}

// 组件配置映射关系
export const propsConfigMap = new Map([
  ['select', { placeholder: (label: string) => `请选择${label}`, defaultProps: { options: [] } }],
  [
    'date',
    { placeholder: (label: string) => `请选择${label}`, defaultProps: { type: 'date', valueFormat: 'YYYY-MM-DD' } }
  ],
  [
    'daterange',
    {
      placeholder: '', // 日期范围不需要统一placeholder
      defaultProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        rangeSeparator: '至',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期'
      }
    }
  ]
])

/**
 * 获取对应类型的组件
 * @param field 筛选字段配置
 * @returns 组件名称或自定义组件
 */
export const resolveComponentByField = (field: FormField) => {
  return field.type === 'custom' ? field.component : componentMap[field.type] || ElInput
}

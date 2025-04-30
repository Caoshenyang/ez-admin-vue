/* eslint-disable @typescript-eslint/no-explicit-any */

import type { FormField } from '@/types/crud'

// 选项类型
export interface FieldOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface ActionItem {
  name: string // 操作唯一标识
  label: string // 显示文本
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' // 按钮类型
  icon?: string | Component // 按钮图标
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

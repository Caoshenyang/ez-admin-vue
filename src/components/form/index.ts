import type { FormField } from '@/types/crud'
import {
  ElInput,
  ElInputNumber,
  ElSelect,
  ElRadioGroup,
  ElCheckboxGroup,
  ElSwitch,
  ElDatePicker,
  ElTreeSelect
} from 'element-plus'
export interface EZFormProps {
  fields: FormField[] // 表单字段
  formData: Record<string, unknown> // 表单数据
  columns?: number // 表单列数
  labelWidth?: string | number // 表单标签宽度
  submitOnEnter?: boolean // 是否在按下回车键时提交表单
}

// 组件映射表
export const componentMap = {
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

import {
  ElInput,
  ElInputNumber,
  ElSelect,
  ElRadioGroup,
  ElCheckboxGroup,
  ElSwitch,
  ElDatePicker,
  ElTreeSelect,
  ElLink,
  ElButton,
  ElTag,
  ElImage
} from 'element-plus'

// 组件映射表
const componentMap: Record<string, Component> = {
  input: ElInput,
  textarea: ElInput,
  number: ElInputNumber,
  select: ElSelect,
  treeSelect: ElTreeSelect,
  radio: ElRadioGroup,
  checkbox: ElCheckboxGroup,
  switch: ElSwitch,
  date: ElDatePicker,
  daterange: ElDatePicker,
  link: ElLink,
  button: ElButton,
  tag: ElTag,
  image: ElImage
}

/**
 * 获取对应类型的组件
 * @param field 筛选字段配置
 * @returns 组件名称或自定义组件
 */
export const resolveComponentByFieldType = (type: string): Component => {
  return componentMap[type] || ElInput
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

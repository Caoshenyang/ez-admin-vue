/* eslint-disable @typescript-eslint/no-explicit-any */

import type { FormField } from '../layout/actionbar'

// 表单配置
export interface FormSchema {
  title?: string // 表单标题
  layout?: 'horizontal' | 'vertical' // 表单布局
  columns?: number // 表单列数
  labelWidth?: string | number // 表单标签宽度
  fields: FormField[] // 表单字段
}

export interface EZFormProps {
  schema: FormSchema // 表单配置
  formData: Record<string, unknown> // 表单数据
  submitOnEnter?: boolean // 是否在按下回车键时提交表单
}

import type { FormField } from '../layout/actionbar'

export interface EZFormProps {
  fields: FormField[] // 表单字段
  formData: Record<string, unknown> // 表单数据
  columns?: number // 表单列数
  labelWidth?: string | number // 表单标签宽度
  submitOnEnter?: boolean // 是否在按下回车键时提交表单
}

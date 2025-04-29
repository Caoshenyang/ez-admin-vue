<script setup lang="ts" generic="F extends Record<string, unknown>">
import { ref, computed, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import { propsConfigMap, resolveComponentByField, type EZFormProps } from '.'
import 'element-plus/es/components/input-number/style/css' // 手动引入样式, 动态组件这里样式不会生效
import 'element-plus/es/components/date-picker/style/css' // 手动引入样式, 动态组件这里样式不会生效
import 'element-plus/es/components/tree-select/style/css' // 手动引入样式, 动态组件这里样式不会生效
import { type FormField } from '@/types/crud'

const props = withDefaults(defineProps<EZFormProps<F>>(), {
  fields: () => [],
  labelWidth: '80px',
  columns: 2, // 表单列数
  submitOnEnter: true
})

const emit = defineEmits(['submit'])
const formRef = ref<FormInstance>()
const formModel = ref({ ...props.formData })

// 监听props变化同步数据 父组件 -> 子组件
watch(
  () => props.formData,
  (val) => (formModel.value = { ...val })
)

// 动态props计算
const getComponentProps = (field: FormField) => {
  const config = propsConfigMap.get(field.type) || {
    placeholder: (label: string) => `请输入${label}`,
    defaultProps: {}
  }

  return {
    clearable: true,
    style: { width: '100%' },
    placeholder: typeof config.placeholder === 'function' ? config.placeholder(field.label) : config.placeholder,
    ...config.defaultProps,
    ...field.props
  }
}

// 选项数据标准化
const normalizeOptions = (options: unknown) =>
  Array.isArray(options)
    ? options.map((opt) => ({
        label: String(opt.label || ''),
        value: opt.value,
        disabled: Boolean(opt.disabled)
      }))
    : []

// 动态选项获取
const getOptions = (field: FormField) => {
  return 'options' in field ? (typeof field.options === 'function' ? [] : normalizeOptions(field.options)) : []
}

// 可见字段过滤
const visibleFields = computed(() =>
  props.fields.filter((field) => (typeof field.hidden === 'function' ? !field.hidden() : !field.hidden))
)

// 表单操作API
const formActions = {
  validate: () => formRef.value?.validate(),
  resetFields: () => formRef.value?.resetFields(),
  submit: async () => {
    try {
      await formRef.value?.validate()
      return { valid: true, data: { ...formModel.value } }
    } catch (error) {
      return { valid: false, error }
    }
  },
  getData: () => formModel.value
}

// 回车提交处理
const handleKeydown = (e: KeyboardEvent) => {
  if (props.submitOnEnter && e.key === 'Enter') {
    e.preventDefault()
    emit('submit')
  }
}
defineExpose(formActions)
</script>

<template>
  <el-form ref="formRef" :model="formModel" :label-width="labelWidth" @keydown.enter.prevent="handleKeydown">
    <el-row :gutter="20">
      <el-col v-for="field in visibleFields" :key="field.prop" :span="field.span || 24 / (columns || 1)">
        <el-form-item :label="field.label" :label-width="field.labelWidth" :prop="field.prop" :rules="field.rules">
          <!-- 动态组件渲染 -->
          <component
            :is="resolveComponentByField(field)"
            v-model="formModel[field.prop]"
            v-bind="getComponentProps(field)"
          >
            <template v-if="['select', 'radio', 'checkbox'].includes(field.type)">
              <template v-for="option in getOptions(field)" :key="option.value">
                <el-option
                  v-if="field.type === 'select'"
                  :label="option.label"
                  :value="option.value"
                  :disabled="option.disabled"
                />
                <el-radio v-else-if="field.type === 'radio'" :value="option.value" :disabled="option.disabled">
                  {{ option.label }}
                </el-radio>
                <el-checkbox v-else :label="option.value" :disabled="option.disabled">
                  {{ option.label }}
                </el-checkbox>
              </template>
            </template>
          </component>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<style lang="scss" scoped></style>

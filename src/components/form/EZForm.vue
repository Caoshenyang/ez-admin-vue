<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import { type EZFormProps, type FormField } from '.'

const props = withDefaults(defineProps<EZFormProps>(), {
  submitOnEnter: true
})

const emit = defineEmits(['submit'])
const formRef = ref<FormInstance>()
const formModel = ref({ ...props.formData }) // 更语义化的命名

// 监听props变化同步数据 父组件 -> 子组件
watch(
  () => props.formData,
  (val) => (formModel.value = { ...val })
)

// 动态props计算
const getComponentProps = (field: FormField) => {
  const disabled = typeof field.disabled === 'function' ? field.disabled() : field.disabled

  return {
    disabled,
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
const getOptions = (field: SelectableFieldConfig) =>
  'options' in field ? (typeof field.options === 'function' ? [] : normalizeOptions(field.options)) : []

// 可见字段过滤
const visibleFields = computed(() =>
  props.schema.fields.filter((field) =>
    typeof field.hidden === 'function' ? !field.hidden(formModel.value) : !field.hidden
  )
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
  <el-form
    ref="formRef"
    :model="formModel"
    :label-width="schema.labelWidth || (schema.layout === 'vertical' ? '0' : 'auto')"
    @keydown.enter.prevent="handleKeydown"
  >
    <el-row :gutter="20">
      <el-col v-for="field in visibleFields" :key="field.name" :span="field.span || 24 / (schema.columns || 1)">
        <el-form-item
          :label="schema.layout === 'vertical' ? undefined : field.label"
          :prop="field.name"
          :rules="field.rules"
        >
          <component
            :is="resolveComponent(field)"
            v-model="formModel[field.name]"
            v-bind="getComponentProps(field)"
            v-on="field.events || {}"
          >
            <template v-if="['select', 'radio', 'checkbox'].includes(field.type)">
              <template v-for="option in getOptions(field as SelectableFieldConfig)" :key="option.value">
                <el-option
                  v-if="field.type === 'select'"
                  :label="option.label"
                  :value="option.value"
                  :disabled="option.disabled"
                />
                <el-radio v-else-if="field.type === 'radio'" :label="option.value" :disabled="option.disabled">
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

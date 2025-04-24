<script setup lang="ts">
import type { FormSchema } from '../form'
import type EZForm from '../form/EZForm.vue'

const props = withDefaults(
  defineProps<{
    visible: boolean // 控制对话框显示隐藏
    title: string // 对话框标题
    schema: FormSchema // 表单配置
    width?: number // 对话框宽度
    initialData?: Record<string, unknown> // 初始数据
    loading?: boolean // 控制对话框加载状态
  }>(),
  {
    width: 500
  }
)

// 定义事件
const emit = defineEmits(['update:visible', 'confirm'])

const formRef = ref<InstanceType<typeof EZForm>>()
const formData = ref<Record<string, unknown>>({})

// 初始化表单数据
const initFormData = () => {
  const defaultValues: Record<string, unknown> = {}
  props.schema.fields.forEach((field) => {
    defaultValues[field.name] = field.defaultValue ?? ''
  })
  formData.value = { ...defaultValues, ...props.initialData }
}

// 计算属性处理
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 监听visible属性，初始化表单数据
watch(
  () => props.visible,
  (val) => {
    if (val) initFormData()
  }
)

const handleConfirm = async () => {
  // 表单验证逻辑
  const result = await formRef.value?.submit()
  if (!result?.valid) return

  emit('confirm')
  dialogVisible.value = false
}

const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

const resetForm = () => {
  // 重置表单
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="width"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <EZForm ref="formRef" :schema="schema" :formData="formData" submit-on-enter />

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

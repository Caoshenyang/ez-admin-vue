<script setup lang="ts" generic="F">
import type { FormField } from '@/types/crud'
import { cloneDeep } from 'lodash-es'

interface FormDialogProps<F> {
  visible: boolean // 控制对话框显示隐藏
  title: string // 对话框标题
  fields: FormField[] // 表单配置
  width?: number // 对话框宽度
  initialData: F // 使用泛型类型F
}

const props = withDefaults(defineProps<FormDialogProps<F>>(), {
  width: 500
})

// 定义事件
const emit = defineEmits(['update:visible', 'confirm'])

const formRef = ref()

// 内部表单数据
const formData = ref<F>(cloneDeep(props.initialData))

// 初始化表单数据
const initFormData = () => {
  const defaultValues: Record<string, unknown> = {}
  props.fields.forEach((field) => {
    defaultValues[field.prop] = field.defaultValue ?? ''
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
  emit('confirm', formRef.value?.getData())
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
  <div class="dialog-container">
    <el-dialog v-model="dialogVisible" :width="width" :before-close="handleClose" :close-on-click-modal="false">
      <template #header>{{ title }}</template>

      <EZForm class="dialog-body" ref="formRef" :fields="fields" :formData="formData" submit-on-enter />

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleConfirm"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.dialog-container {
  // 禁止光标选择
  user-select: none;
}
.dialog-body {
  padding: 20px 10px;
}
</style>

<script lang="ts" setup>
import { ref, defineExpose } from 'vue'

defineProps({
  title: { type: String, default: '标题' },
  width: { type: String, default: '50%' }
})

const emit = defineEmits(['confirm', 'close'])

// 完全内部管理状态
const isVisible = ref(false)

// 暴露给外部的方法
const open = () => {
  isVisible.value = true
}

const close = () => {
  isVisible.value = false
  emit('close')
}

const confirm = () => {
  emit('confirm')
}

// 对外暴露方法
defineExpose({ open, close })
</script>

<template>
  <div class="form-dialog">
    <el-dialog v-model="isVisible" :title="title" :width="width">
      <slot></slot>

      <template #footer>
        <slot name="footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </slot>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.form-dialog {
  // 禁止光标选择
  user-select: none;
  // 自定义样式可以放在这里
  :deep(.el-dialog__body) {
    padding: 10px;
    max-height: 70vh;
    overflow-y: auto;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
  }
}
</style>

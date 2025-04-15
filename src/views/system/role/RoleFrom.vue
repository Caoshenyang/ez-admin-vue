<script lang="ts" setup>
const emits = defineEmits(['confirm'])
const visible = ref<boolean>(false) // 是否显示
const title = ref<string>('新增角色') // 标题

const open = async (roleId?: string) => {
  visible.value = true
}

defineExpose({ open })
</script>
<template>
  <div>
    <el-dialog class="dialog-container" v-model="visible" @closed="resetForm" :close-on-click-modal="false">
      <template #header>{{ title }}</template>
      <el-form label-width="auto" class="dialog-body" ref="menuFormRef" :model="menuFormData" :rules="rules"> </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close" :disabled="loading">取消</el-button>
          <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>

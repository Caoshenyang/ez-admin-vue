<script setup lang="ts" generic="F, T, Q">
import { useButtonActions } from '@/composables/useButtonActions'
import { useCrud } from '@/composables/useCrud'
import { useUserStore } from '@/stores/modules/userStore'
import type { CrudConfig } from '@/types/crud'
import { useRoute } from 'vue-router'

const props = defineProps<{
  config: CrudConfig<F, Q, T>
}>()

const { loading, data, formData, dialog, loadData, handleCreate, handleEdit, handleDelete, handleSubmit } = useCrud(
  props.config
)

const selectedRows = ref<T[]>([])

const userStore = useUserStore()
// 从路由参数中获取当前用户的按钮相关信息
const route = useRoute()
const actions = ref(useButtonActions(userStore.buttonRecords[route.fullPath as string], selectedRows))

// 初始化加载数据
onMounted(() => loadData())

// 动态组件解析
const componentMap = new Map([
  ['input', resolveComponent('el-input')],
  ['select', resolveComponent('el-select')],
  ['tree-select', resolveComponent('el-tree-select')]
  // 添加更多组件映射
])

// 所有操作的处理函数
const actionHandlers = {
  refresh: loadData,
  add: handleCreate,
  edit: (row: unknown) => handleEdit(row as Partial<F>),
  delete: (ids: unknown) => handleDelete(ids as string[])
}

// 调用方式
const handleAction = (actionName: keyof typeof actionHandlers, payload?: unknown) => {
  actionHandlers[actionName]?.(payload)
}

const handleSelectionChange = (rows: T[]) => {
  selectedRows.value = rows
  console.log(selectedRows.value)
  actions.value = useButtonActions(userStore.buttonRecords[route.fullPath as string], selectedRows)
  console.log(actions.value)
}
</script>

<template>
  <div class="crud-container">
    <AppActionBar ref="actionBarRef" :actions="actions" @search="loadData" @action="handleAction" />
    <!-- 数据表格 -->

    <!-- 表单对话框 -->
    <EZFormDialog
      v-model:visible="dialog.visible"
      :initial-data="formData"
      :title="dialog.title"
      :fields="config.form.fields"
      @confirm="handleSubmit"
    />
  </div>
</template>

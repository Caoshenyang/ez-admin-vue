<script setup lang="ts">
import type { DeptForm, DeptQuery, DeptTreeVO } from '@/types/system'
import { tableConfig, actionsConfig, formConfig, name } from './config'
import { deptApi } from '@/api/system/dept'
import { useUserStore } from '@/stores/modules/userStore'
import router from '@/router'
import { useButtonActions } from '@/composables/useButtonActions'

const loading = ref(false)
const selectRows = ref<DeptTreeVO[]>([])
const tableData = ref<DeptTreeVO[]>([])
const dialog = ref({
  visible: false,
  title: '',
  mode: 'create' as 'create' | 'edit'
})
const queryParams = ref<DeptQuery>({
  deptName: ''
})
const userStore = useUserStore()

const buttons = userStore.getButtons(router.currentRoute.value.path)

const actions = computed(() => useButtonActions(buttons, selectRows.value))

console.log(actions)

const loadData = async () => {
  loading.value = true
  try {
    tableData.value = await deptApi.getDeptList({ ...queryParams.value })
  } catch (error) {
    console.error('加载数据失败:', error)
    throw error
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  loadData()
})

const handleCreate = () => {
  // resetForm()
  dialog.value = {
    visible: true,
    title: `新增${name}`,
    mode: 'create'
  }
}

const handleEdit = (row: DeptForm) => {
  console.log(row)
}

const handleDelete = (ids: string[]) => {
  console.log(ids)
}

// 所有操作的处理函数
const actionHandlers = {
  refresh: loadData,
  add: handleCreate,
  edit: (row: unknown) => handleEdit(row as DeptForm),
  delete: (ids: unknown) => handleDelete(ids as string[])
}

// 调用方式
const handleAction = (actionName: keyof typeof actionHandlers, payload?: unknown) => {
  actionHandlers[actionName]?.(payload)
}

const handleSelectionChange = (rows: DeptTreeVO[]) => {
  selectRows.value = rows
}

const handleSubmit = () => {}

// 加载列表数据
</script>

<template>
  <div class="dept-container">
    <AppActionBar
      :query-params="actionsConfig.queryParams"
      :actions="actions"
      @query="loadData"
      @action="handleAction"
    />
    <EZTable :loading="loading" :config="tableConfig" :data="tableData" @selection-change="handleSelectionChange" />
    <!-- 表单对话框 -->
    <EZFormDialog
      v-model:visible="dialog.visible"
      :initial-data="formConfig.formData"
      :title="dialog.title"
      :fields="formConfig.fields"
      @confirm="handleSubmit"
    />
  </div>
</template>

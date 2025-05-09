<script setup lang="ts">
import type { DeptQuery, DeptTreeVO } from '@/types/system'
import { tableConfig, actionsConfig } from './config'
import { deptApi } from '@/api/system/dept'
import { useUserStore } from '@/stores/modules/userStore'
import router from '@/router'
import { useButtonActions } from '@/composables/useButtonActions'

const loading = ref(false)
const selectRows = ref<DeptTreeVO[]>([])
const tableData = ref<DeptTreeVO[]>([])
const queryParams = ref<DeptQuery>({
  deptName: ''
})
const userStore = useUserStore()

const buttons = userStore.getButtons(router.currentRoute.value.path)
const actions = useButtonActions(buttons, selectRows)
console.log(buttons)

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

const handleSelectionChange = (rows: DeptTreeVO[]) => {
  selectRows.value = rows
}

// 加载列表数据
</script>

<template>
  <div class="dept-container">
    <AppActionBar :query-params="actionsConfig.queryParams" :buttons="actions" />
    <EZTable :loading="loading" :config="tableConfig" :data="tableData" @selection-change="handleSelectionChange" />
  </div>
</template>

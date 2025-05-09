<script setup lang="ts">
import { ref } from 'vue'

interface User {
  id: number
  name: string
  age: number
  status: 'active' | 'inactive'
}

const tableData = ref<User[]>([
  { id: 1, name: '张三', age: 25, status: 'active' },
  { id: 2, name: '李四', age: 30, status: 'inactive' }
])

const tableConfig = {
  showSelection: true,
  showIndex: true,
  columns: [
    { prop: 'name', label: '姓名', width: 120 },
    { prop: 'age', label: '年龄', align: 'center' },
    {
      prop: 'status',
      label: '状态',
      component: 'el-tag',
      formatter: (row: User) => (row.status === 'active' ? '活跃' : '非活跃')
    }
  ]
}

const loading = ref(false)
const handleSelectionChange = (rows: User[]) => {
  console.log('选中行:', rows)
}
</script>

<template>
  <EZTable :data="tableData" :config="tableConfig" :loading="loading" @selection-change="handleSelectionChange" />
</template>

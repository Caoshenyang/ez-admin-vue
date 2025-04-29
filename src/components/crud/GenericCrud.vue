<script setup lang="ts" generic="F extends Record<string, unknown>, T, Q">
import { useCrud } from '@/composables/useCrud'
import type { CrudConfig } from '@/types/crud'

const props = defineProps<{
  config: CrudConfig<F, Q, T>
}>()

const { loading, data, selectedRows, formData, dialog, loadData, handleEdit, handleDelete, handleSubmit } = useCrud(
  props.config
)

// 初始化加载数据
onMounted(() => loadData())

// 动态组件解析
const componentMap = new Map([
  ['input', resolveComponent('el-input')],
  ['select', resolveComponent('el-select')],
  ['tree-select', resolveComponent('el-tree-select')]
  // 添加更多组件映射
])
</script>

<template>
  <div class="crud-container">
    <AppActionBar />

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="data"
      :row-key="config.table.rowKey || 'id'"
      @selection-change="(rows) => (selectedRows = rows)"
    >
      <el-table-column v-if="config.table.showSelection" type="selection" width="55" />
      <el-table-column v-if="config.table.showIndex" type="index" width="50" />

      <template v-for="col in config.table.columns" :key="col.prop">
        <el-table-column v-bind="col">
          <template #default="{ row }">
            <component
              v-if="col.component"
              :is="componentMap.get(col.component as string)"
              v-bind="col.props"
              :model-value="row[col.prop]"
            />
            <template v-else>
              {{ col.formatter ? col.formatter(row) : row[col.prop] }}
            </template>
          </template>
        </el-table-column>
      </template>

      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete([row[config.idKey]])"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
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

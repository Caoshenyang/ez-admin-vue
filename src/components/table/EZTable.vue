<script lang="ts" setup generic="T extends Record<string, any>">
import type { TableProps } from '@/types/common'
import { resolveComponentByFieldType } from '@/utils/dynamicComponent'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    data: T[]
    config: TableProps
    loading?: boolean
  }>(),
  {
    loading: false
  }
)
const emit = defineEmits<{
  (e: 'selection-change', rows: T[]): void
}>()

const handleSelectionChange = (rows: T[]) => {
  emit('selection-change', rows)
}

// 计算属性确保默认值
const tableConfig = computed(() => ({
  showSelection: false,
  showIndex: false,
  rowKey: 'id',
  ...props.config
}))
</script>

<template>
  <el-table v-loading="loading" :data="data" :row-key="tableConfig.rowKey" @selection-change="handleSelectionChange">
    <el-table-column v-if="tableConfig.showSelection" type="selection" width="55" />
    <el-table-column v-if="tableConfig.showIndex" type="index" width="50" />

    <template v-for="col in tableConfig.columns" :key="col.prop">
      <el-table-column v-bind="col">
        <template #default="{ row }">
          <component
            v-if="col.component"
            :is="resolveComponentByFieldType(col.component)"
            v-bind="col"
            :model-value="row[col.prop]"
          >
            {{ col.formatter ? col.formatter(row) : row[col.prop] }}
          </component>
          <template v-else>
            {{ col.formatter ? col.formatter(row) : row[col.prop] }}
          </template>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<style lang="scss" scoped></style>

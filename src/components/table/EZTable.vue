<script lang="ts" setup generic="T extends Record<string, any>">
import { ElTag } from 'element-plus'
import { computed } from 'vue'

interface TableColumn {
  prop: string
  label: string
  width?: number | string
  minWidth?: number | string
  align?: 'left' | 'center' | 'right'
  fixed?: boolean | 'left' | 'right'
  component?: string
  formatter?: (row: T) => string
  [key: string]: unknown
}

interface TableConfig {
  showSelection?: boolean
  showIndex?: boolean
  rowKey?: string
  columns: TableColumn[]
}

const props = withDefaults(
  defineProps<{
    data: T[]
    config: TableConfig
    loading?: boolean
  }>(),
  {
    loading: false
  }
)

const emit = defineEmits<{
  (e: 'selection-change', rows: T[]): void
}>()

const componentMap = new Map<string, unknown>(
  Object.entries({
    'el-link': 'el-link',
    'el-button': 'el-button',
    'el-switch': 'el-switch',
    'el-tag': ElTag,
    'el-image': 'el-image'
  })
)

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
            :is="componentMap.get(col.component)"
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

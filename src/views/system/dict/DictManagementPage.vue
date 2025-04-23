<script lang="ts" setup>
import { dictApi } from '@/api/system/dict'
import type { ActionItem, FilterItem } from '@/components/layout/actionbar'
import type { PageQuery, PageVO } from '@/types/common'
import type { DictDataListVO, DictTypeListVO, DictTypeQuery } from '@/types/system'
import { Delete, Download, EditPen, Plus } from '@element-plus/icons-vue'

// 字典类型数据
const dictTypeTableData = ref<PageVO<DictTypeListVO>>()
// 字典类型对应详情数据
const dictDataTableData = ref<DictDataListVO[]>()
// 选中的字典类型
const selectedDictType = ref<DictTypeListVO[]>([])

// 字典类型查询参数
const dictTypeQuery = reactive<PageQuery<DictTypeQuery>>({
  pageNum: 1,
  pageSize: 15,
  search: {}
})

onMounted(() => {
  refreshList()
})

// 刷新字典类型列表
const refreshList = async () => {
  dictTypeTableData.value = await dictApi.selectDictTypePage(dictTypeQuery)
}

// 编辑字典类型
const handleEdit = (id: string) => {
  console.log(id)
}

// 删除字典类型
const handleDelete = (isBatch: boolean, id?: string) => {
  console.log(isBatch, id)
}

// 处理复选框选择事件
const handleSelectionChange = (val: DictTypeListVO[]) => {
  console.log(val)
}

// 点击类型，查询字典数据
const handleCellClick = (val: DictTypeListVO) => {
  console.log(val)
}

// 修改每页条数
const handleSizeChange = (pageSize: number) => {
  dictTypeQuery.pageSize = pageSize
  refreshList()
}
// 翻页
const handleCurrentChange = (pageNum: number) => {
  dictTypeQuery.pageNum = pageNum
  refreshList()
}

// 操作栏配置
// 筛选字段配置
const filters: FilterItem[] = [
  // 基础筛选字段
  {
    prop: 'name',
    label: '姓名',
    type: 'input'
  },
  {
    prop: 'gender',
    label: '性别',
    type: 'select',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' }
    ],
    span: 4
  },
  {
    prop: 'birthDate',
    label: '出生日期',
    type: 'date'
  },

  // 扩展筛选字段（默认折叠）
  {
    prop: 'email',
    label: '邮箱',
    type: 'input',
    collapsed: true
  },
  {
    prop: 'createTime',
    label: '创建时间范围',
    type: 'daterange',
    collapsed: true
  },

  // 系统字段（不会显示在UI上）
  {
    prop: 'isVip',
    label: 'VIP用户',
    type: 'select',
    system: true,
    options: [
      { label: '是', value: 1 },
      { label: '否', value: 0 }
    ]
  }
]

// 操作按钮配置
const actions: ActionItem[] = [
  {
    name: 'add',
    label: '新增',
    type: 'primary',
    icon: Plus,
    tooltip: '添加新数据'
  },
  {
    name: 'edit',
    label: '编辑',
    type: 'success',
    icon: EditPen,
    tooltip: '编辑'
  },
  {
    name: 'batchDelete',
    label: '批量删除',
    type: 'danger',
    icon: Delete,
    tooltip: '删除选中数据',
    disabled: () => selectedDictType.value.length === 0
  },
  {
    name: 'print',
    label: '导出',
    type: 'warning',
    icon: Download,
    tooltip: '导出'
  }
]

// 处理搜索
const handleSearch = (params: Record<string, unknown>) => {
  console.log('搜索参数:', params)
  // 调用API获取数据...
}

// 处理重置
const handleReset = () => {
  console.log('重置搜索')
  // 重置数据...
}

// 处理操作按钮
const handleAction = (actionName: string) => {
  console.log('执行操作:', actionName)
  switch (actionName) {
    case 'add':
      // 打开新增对话框
      break
    case 'export':
      // 执行导出逻辑
      break
    // 其他操作处理...
  }
}
</script>
<template>
  <div class="dict-container">
    <AppActionBar
      :filters="filters"
      :actions="actions"
      @search="handleSearch"
      @reset="handleReset"
      @action="handleAction"
    />

    <!-- 左右分栏布局 -->
    <el-row :gutter="20">
      <el-col :span="11">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>字典类型</span>
            </div>
          </template>
          <el-table
            stripe
            highlight-current-row
            :data="dictTypeTableData?.records"
            @selection-change="handleSelectionChange"
            @cell-click="handleCellClick"
          >
            <!-- 选项 -->
            <el-table-column type="selection" />
            <!-- 序号 -->
            <el-table-column type="index" label="序号" width="80" />
            <el-table-column prop="dictName" label="名称" />
            <el-table-column prop="dictType" label="类型" />
            <el-table-column prop="status" label="状态" />
            <el-table-column prop="desciption" label="描述" />
            <!-- 操作 -->
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleEdit(row.dictId)">编辑</el-button>
                <el-button type="danger" link @click="handleDelete(row.dictId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <template #footer>
            <el-pagination
              v-model:current-page="dictTypeQuery.pageNum"
              v-model:page-size="dictTypeQuery.pageSize"
              :page-sizes="[15, 30, 45, 60]"
              :background="false"
              layout="total, prev, pager, next, sizes"
              :total="dictTypeTableData?.total || 0"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </template>
        </el-card>
      </el-col>

      <el-col :span="13">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>字典详情</span>
            </div>
          </template>
          <el-table stripe highlight-current-row :data="dictDataTableData">
            <!-- 选项 -->
            <el-table-column type="selection" />
            <el-table-column type="index" label="序号" width="80" />
            <el-table-column prop="dictLabel" label="标签" />
            <el-table-column prop="dictValue" label="值" />
            <el-table-column prop="dictSort" label="排序" />
            <el-table-column prop="status" label="状态" />
            <el-table-column prop="desciption" label="描述" />
            <!-- 操作 -->
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleEdit(row.dictId)">编辑</el-button>
                <el-button type="danger" link @click="handleDelete(row.dictId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.card-header {
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

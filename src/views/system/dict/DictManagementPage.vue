<script lang="ts" setup>
import { dictApi } from '@/api/system/dict'
import type { PageQuery, PageVO } from '@/types/common'
import type { DictDataListVO, DictTypeListVO, DictTypeQuery } from '@/types/system'
import { roleFormField, actions, filters } from './data'

// 字典类型数据
const dictTypeTableData = ref<PageVO<DictTypeListVO>>()
// 字典类型对应详情数据
const dictDataTableData = ref<DictDataListVO[]>()
// 选中的字典类型
const selectedDictType = ref<DictTypeListVO[]>([])

const dialogVisible = ref(false)
const loading = ref(false)
const currentRoleId = ref<string | null>(null)

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
      openForm()
      break
    case 'export':
      // 执行导出逻辑
      break
    // 其他操作处理...
  }
}

// 打开表单
const openForm = (roleData?: any) => {
  currentRoleId.value = roleData?.id || null
  dialogVisible.value = true
}

// 提交表单
const handleConfirm = async (formData: any) => {
  loading.value = true
  try {
    if (currentRoleId.value) {
    } else {
    }
    dialogVisible.value = false
    // 刷新列表数据...
    ElMessage.success('操作成功')
  } catch (error) {
    console.error('操作失败:', error)
  } finally {
    loading.value = false
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

    <!-- 表单对话框 -->
    <EZFormDialog
      v-model:visible="dialogVisible"
      :title="currentRoleId ? '编辑角色' : '新增角色'"
      :fields="roleFormField"
      :loading="loading"
      @confirm="handleConfirm"
    />
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

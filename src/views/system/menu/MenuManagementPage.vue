<script lang="ts" setup>
import { Delete, Edit, Plus, Refresh, Search, Setting } from '@element-plus/icons-vue'
import MenuForm from './MenuForm.vue'
import { deleteBatchMenuApi, deleteMenuApi, selectMenuTreeApi } from '@/api/system/menu'
import type { MenuTreeVO } from '@/types/auth'
import type { MenuQuery } from '@/types/system'
import { msgInfo, msgSuccess } from '@/utils/message'

const menuTableTreeData = ref<MenuTreeVO[]>([]) // 表格树形数据
const menuFormDialogRef = ref() // 表单弹窗 ref
const selectedRows = ref<MenuTreeVO[]>([]) // 选中的行数据
const isBatchDelete = ref<boolean>(false) // 是否批量删除
const confirmContent = ref<string>('') // 确认框内容
const deleteMenuId = ref<string>() // 删除菜单id

onMounted(() => {
  refreshList()
})

/** 查询对象 */
const menuQuery = reactive<MenuQuery>({
  menuName: '',
  dateRange: []
})

// 刷新列表
const refreshList = async () => {
  await selectMenuTreeApi(menuQuery).then((data: MenuTreeVO[]) => {
    menuTableTreeData.value = data
  })
}

/**
 * 新增
 */
const handleAdd = () => {
  menuFormDialogRef.value.open()
}

/**
 * 编辑
 * @param id menuId
 */
const handleEdit = (id: number) => {
  menuFormDialogRef.value.open(id)
}

/**
 * 删除
 * @param isBatch 是否批量删除
 * @param row 删除行
 */
const handleDelete = (isBatch: boolean, row?: MenuTreeVO) => {
  confirmContent.value = isBatch ? `确定要删除选中的菜单吗？` : `确定要删除该菜单吗？`
  isBatchDelete.value = isBatch
  // 如果不是批量删除，给删除id赋值
  // 如果是批量删除，则从选中的行中取id，即 selectedRows
  if (!isBatch && row) {
    deleteMenuId.value = row.menuId
  }
  ElMessageBox.confirm(confirmContent.value, '删除提醒', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      handleDeleteMenu()
    })
    .catch(() => {
      msgInfo('已取消删除')
    })
}

// 监听表格勾选变化事件
const handleSelectionChange = (val: MenuTreeVO[]) => {
  selectedRows.value = val
}

/**
 * 删除菜单
 */
const handleDeleteMenu = async () => {
  if (isBatchDelete.value) {
    await batchDelete()
  } else {
    await sigleDelete()
  }
  refreshList()
}

const sigleDelete = async () => {
  // 调用接口删除菜单
  await deleteMenuApi(deleteMenuId.value!).then(() => {
    msgSuccess('删除成功')
  })
}
const batchDelete = async () => {
  // 获取所有选择menuId
  const deleteMenuIdList = selectedRows.value.map((item) => item.menuId)
  // 调用接口删除用户
  await deleteBatchMenuApi(deleteMenuIdList).then(() => {
    msgSuccess('删除成功')
  })
}
</script>
<template>
  <div class="menu-container">
    <div class="search-bar">搜索区域</div>
    <div class="operation-bar">
      <div class="operation-button">
        <el-button type="primary" :icon="Plus" plain @click="handleAdd">新增</el-button>
      </div>
      <div class="setting-button">
        <!-- 搜索显示/隐藏 -->
        <el-button :icon="Search" circle />
        <!-- 刷新列表数据 -->
        <el-button :icon="Refresh" circle />
        <!-- 展示列设置 -->
        <el-button :icon="Setting" circle />
      </div>
    </div>
    <div class="table-container">
      <el-table
        stripe
        height="100%"
        highlight-current-row
        :data="menuTableTreeData"
        row-key="menuId"
        default-expand-all
        :header-cell-style="{ 'text-align': 'center' }"
        cell-class-name="select"
        @selection-change="handleSelectionChange"
      >
        <!-- 选项 -->
        <el-table-column type="selection" width="55" />
        <el-table-column prop="menuName" label="菜单名称" />
        <el-table-column prop="icon" label="图标" width="55">
          <template #default="scope">
            <el-icon>
              <component :is="scope.row.icon" v-if="scope.row.icon" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" />
        <el-table-column prop="perms" label="权限标识">
          <template #default="scope">
            <el-tag v-if="scope.row.perms" size="small">{{ scope.row.perms }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由地址" />
        <el-table-column show-overflow-tooltip prop="component" label="组件名称" />
        <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" />
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <div class="table-option">
              <el-button type="success" :icon="Edit" @click="handleEdit(scope.row.menuId)"></el-button>
              <el-button type="danger" :icon="Delete" @click="handleDelete(false)"></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">分页区域</div>
    <MenuForm ref="menuFormDialogRef" @confirm="refreshList" />
  </div>
</template>

<style lang="scss" scoped>
.operation-bar {
  height: 40px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

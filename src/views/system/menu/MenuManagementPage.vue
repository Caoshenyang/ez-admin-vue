<script lang="ts" setup>
import MenuForm from './MenuForm.vue'
import { deleteBatchMenuApi, deleteMenuApi, selectMenuTreeApi } from '@/api/system/menu'
import type { MenuTreeVO } from '@/types/auth'
import type { MenuQuery } from '@/types/system'
import { msgInfo, msgSuccess } from '@/utils/message'
import { Icon } from '@iconify/vue'

const menuTableTreeData = ref<MenuTreeVO[]>([]) // 表格树形数据
const menuFormDialogRef = ref() // 表单弹窗 ref
const selectedRows = ref<MenuTreeVO[]>([]) // 选中的行数据
const confirmContent = ref<string>('') // 确认框内容

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
const handleEdit = (id: string) => {
  menuFormDialogRef.value.open(id)
}

/**
 * 删除
 * @param isBatch 是否批量删除
 * @param row 删除行
 */
const handleDelete = (isBatch: boolean, memuId?: string) => {
  confirmContent.value = isBatch ? `确定要删除选中的菜单吗？` : `确定要删除该菜单吗？`
  // 如果不是批量删除，给删除id赋值

  ElMessageBox.confirm(confirmContent.value, '删除提醒', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      if (!isBatch && memuId) {
        // 调用接口删除菜单
        await deleteMenuApi(memuId)
      } else {
        // 获取所有选择menuId
        const deleteMenuIdList = selectedRows.value.map((item) => item.menuId)
        // 调用接口删除用户
        await deleteBatchMenuApi(deleteMenuIdList)
      }
      msgSuccess('删除成功')
      refreshList()
    })
    .catch(() => {
      msgInfo('已取消删除')
    })
}
// 监听表格勾选变化事件
const handleSelectionChange = (val: MenuTreeVO[]) => {
  selectedRows.value = val
}
</script>
<template>
  <div class="menu-container">
    <div class="search-bar">
      <Icon icon="ep:avatar" />
      <el-button icon="ep:avatar">Home</el-button>
    </div>
    <div class="operation-bar">
      <div class="operation-button">
        <el-button type="primary" :icon="Plus" plain @click="handleAdd">新增</el-button>
      </div>
      <div class="setting-button">
        <!-- 搜索显示/隐藏 -->
        <el-button :icon="Search" circle />
        <!-- 刷新列表数据 -->
        <el-button :icon="Refresh" circle @click="refreshList" />
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
        @selection-change="handleSelectionChange"
      >
        <!-- 选项 -->
        <el-table-column type="selection" width="55" />
        <el-table-column prop="menuName" label="菜单名称" />
        <el-table-column prop="menuIcon" label="图标">
          <template #default="scope">
            <div>{{ scope.row.menuIcon }}</div>
            <CirclePlusFilled />
            <el-icon>

               <IconifyIcon :icon="scope.row.menuIcon" />
              <component :is="scope.row.menuIcon" v-if="scope.row.menuIcon" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="menuSort" label="排序" />
        <el-table-column prop="menuPerms" label="权限标识">
          <template #default="scope">
            <el-tag v-if="scope.row.perms" size="small">{{ scope.row.menuPerms }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="routePath" label="路由地址" />
        <el-table-column show-overflow-tooltip prop="updateTime" label="更新时间" />
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <div class="table-option">
              <el-button type="success" plain :icon="Edit" @click="handleEdit(scope.row.menuId)"></el-button>
              <el-button type="danger" plain :icon="Delete" @click="handleDelete(false, scope.row.menuId)"></el-button>
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

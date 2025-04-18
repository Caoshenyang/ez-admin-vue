<script lang="ts" setup>
import MenuForm from './MenuForm.vue'
import { menuApi } from '@/api/system/menu'
import type { MenuTreeVO } from '@/types/auth'
import type { MenuQuery } from '@/types/system'
import { msgInfo, msgSuccess } from '@/utils/message'

const menuTableTreeData = ref<MenuTreeVO[]>([]) // 表格树形数据
const menuFormDialogRef = ref() // 表单弹窗 ref
const selectedRows = ref<MenuTreeVO[]>([]) // 选中的行数据

onMounted(() => {
  refreshList()
})

/** 查询对象 */
const menuQuery = reactive<MenuQuery>({
  menuName: ''
})

// 刷新列表
const refreshList = async () => {
  const data = await menuApi.selectMenuTree(menuQuery)
  menuTableTreeData.value = data
}

/**
 * 新增
 */
const handleAdd = () => {
  menuFormDialogRef.value.open()
}

/**
 * 新增子节点
 */
const handleAddChildren = (parentId: string) => {
  menuFormDialogRef.value.addChildren(parentId)
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
  // 如果不是批量删除，给删除id赋值
  ElMessageBox.confirm(isBatch ? `确定要删除选中的菜单吗？` : `确定要删除该菜单吗？`, '删除提醒', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      if (!isBatch && memuId) {
        // 调用接口删除菜单
        await menuApi.deleteMenu(memuId)
      } else {
        // 获取所有选择menuId
        const deleteMenuIdList = selectedRows.value.map((item) => item.menuId)
        // 调用接口删除用户
        await menuApi.deleteBatchMenu(deleteMenuIdList)
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
    <div class="search-bar">搜索区域</div>
    <div class="operation-bar">
      <div class="operation-button">
        <el-button type="primary" plain @click="handleAdd">
          <template #icon>
            <EZSvgIcon icon="ep:plus" />
          </template>
          新增
        </el-button>
      </div>
      <div class="setting-button">
        <!-- 搜索显示/隐藏 -->
        <el-button circle>
          <template #icon>
            <EZSvgIcon icon="ep:search" />
          </template>
        </el-button>
        <!-- 刷新列表数据 -->
        <el-button circle @click="refreshList">
          <template #icon>
            <EZSvgIcon icon="ep:refresh" />
          </template>
        </el-button>
        <!-- 展示列设置 -->
        <el-button circle>
          <template #icon>
            <EZSvgIcon icon="ep:setting" />
          </template>
        </el-button>
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
            <el-icon :size="20">
              <EZSvgIcon :icon="scope.row.menuIcon" v-if="scope.row.menuIcon" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="menuSort" label="排序" />
        <el-table-column prop="menuPerm" label="权限标识">
          <template #default="scope">
            <el-tag v-if="scope.row.menuPerm" size="small">{{ scope.row.menuPerm}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="routePath" label="路由地址" />
        <el-table-column show-overflow-tooltip prop="updateTime" label="更新时间" />
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <div class="table-option">
              <el-button type="primary" plain @click="handleAddChildren(scope.row.menuId)">
                <template #icon>
                  <EZSvgIcon icon="ep:plus" />
                </template>
              </el-button>
              <el-button type="success" plain @click="handleEdit(scope.row.menuId)">
                <template #icon>
                  <EZSvgIcon icon="ep:edit-pen" />
                </template>
              </el-button>
              <el-button type="danger" plain @click="handleDelete(false, scope.row.menuId)">
                <template #icon>
                  <EZSvgIcon icon="ep:delete" />
                </template>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <MenuForm ref="menuFormDialogRef" @confirm="refreshList" />
  </div>
</template>

<style lang="scss" scoped></style>

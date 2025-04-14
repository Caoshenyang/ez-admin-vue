<script lang="ts" setup>
import { roleApi } from '@/api/system/role'
import type { MenuQuery, RoleListVO, RoleQuery } from '@/types/system'
import { DataScopeEnum, StatusEnum } from '@/enums/appEnums'
import { type PageQuery, type PageVO } from '@/types/common'
import type { MenuTreeVO } from '@/types/auth'
import { menuApi } from '@/api/system/menu'
import { useLoading } from '@/composables/useLoading'

const { withLoading, isLoading } = useLoading()

const roleTableData = ref<PageVO<RoleListVO>>()

const menuTreeData = ref<MenuTreeVO[]>([])
const menuTreeRef = ref()

const menuTreeProps = {
  children: 'children',
  label: 'menuName'
}

onMounted(() => {
  refreshList()
})

/** 查询对象 */
const roleQuery = reactive<PageQuery<RoleQuery>>({
  pageNum: 1,
  pageSize: 15,
  search: {
    roleName: '',
    dateRange: []
  }
})

/** 查询对象 */
const menuQuery = reactive<MenuQuery>({
  status: 1
})

const handleSizeChange = (pageSize: number) => {
  roleQuery.pageSize = pageSize
  refreshList()
}
const handleCurrentChange = (pageNum: number) => {
  roleQuery.pageNum = pageNum
  refreshList()
}

// 刷新列表
const refreshList = async () => {
  await Promise.all([
    withLoading(
      'roleTableData',
      roleApi.selectRoleList(roleQuery).then((data) => (roleTableData.value = data))
    ),
    withLoading(
      'menuTreeData',
      menuApi.selectMenuTree(menuQuery).then((data) => (menuTreeData.value = data))
    )
  ])
}

const handleAdd = () => {
  console.log('add')
}

const handleEdit = (row: any) => {
  console.log(row)
}

const handleDelete = (row: any) => {
  console.log(row)
}

const handleSelectionChange = (roleItem: RoleListVO) => {
  console.log(roleItem)
}
const handleCellClick = (roleItem: RoleListVO) => {}
</script>
<template>
  <div class="role-container">
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
    <div class="content-container">
      <el-card class="table-container">
        <template #header>
          <div class="card-header">
            <span>角色列表</span>
          </div>
        </template>
        <el-table
          v-loading="isLoading('roleTableData')"
          stripe
          height="100%"
          highlight-current-row
          :data="roleTableData?.records"
          row-key="menuId"
          default-expand-all
          @selection-change="handleSelectionChange"
          @cell-click="handleCellClick"
        >
          <!-- 选项 -->
          <el-table-column type="selection" width="55" />
          <el-table-column prop="roleName" label="名称" />
          <el-table-column prop="roleLabel" label="标识" />
          <el-table-column prop="dataScope" label="数据权限">
            <template #default="scope">
              <el-tag>
                <!-- 使用枚举优化 -->
                {{ DataScopeEnum[scope.row.dataScope] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="roleSort" label="排序" />
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                {{ StatusEnum[scope.row.status] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="180">
            <template #default="scope">
              <div class="table-option">
                <el-button type="success" plain @click="handleEdit(scope.row.roleId)">
                  <template #icon>
                    <EZSvgIcon icon="ep:edit-pen" />
                  </template>
                </el-button>
                <el-button type="danger" plain>
                  <template #icon>
                    <EZSvgIcon icon="ep:delete" />
                  </template>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <template #footer>
          <el-pagination
            v-model:current-page="roleQuery.pageNum"
            v-model:page-size="roleQuery.pageSize"
            :page-sizes="[15, 30, 45, 60]"
            :background="false"
            layout="total, prev, pager, next, sizes"
            :total="roleTableData?.total || 0"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </template>
      </el-card>
      <el-card class="menu-container">
        <template #header>
          <div class="card-header">
            <span>菜单列表</span>
            <el-button type="primary">保存</el-button>
          </div>
        </template>
        <div class="menu-tree">
          <el-tree
            v-loading="isLoading('menuTreeData')"
            ref="menuTreeRef"
            :data="menuTreeData"
            :props="menuTreeProps"
            accordion
            show-checkbox
            node-key="menuId"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-container {
  display: flex;
  gap: 20px;
}

.table-container {
  flex: 1;
  height: 100%;
}
.menu-container {
  width: 480px;
  height: 100%;
}
.card-header {
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

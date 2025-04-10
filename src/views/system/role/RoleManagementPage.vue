<script lang="ts" setup>
import { selectRoleListApi } from '@/api/system/role'
import type { RoleListVO, RoleQuery } from '@/types/system'
import { DataScopeEnum, StatusEnum } from '@/enums/appEnums'

const roleTableData = ref<RoleListVO[]>([])

onMounted(() => {
  refreshList()
})

/** 查询对象 */
const roleQuery = reactive<RoleQuery>({
  roleName: '',
  dateRange: []
})

// 刷新列表
const refreshList = async () => {
  const data = await selectRoleListApi(roleQuery)
  roleTableData.value = data.records
  console.log(data)
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

const handleSelectionChange = (val: any) => {
  console.log(val)
}
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
        <el-button circle>
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
          stripe
          height="100%"
          highlight-current-row
          :data="roleTableData"
          row-key="menuId"
          default-expand-all
          @selection-change="handleSelectionChange"
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
            v-model:current-page="currentPage3"
            :page-sizes="[100, 200, 300, 400]"
            layout="total, prev, pager, next, sizes"
            :total="400"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </template>
      </el-card>
      <el-card class="menu-container">
        <template #header>
          <div class="card-header">
            <span>菜单列表</span>
          </div>
        </template>
        <div class="menu-tree">菜单树</div>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.role-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.content-container {
  display: flex;
  gap: 20px;
}
.table-container {
  flex: 1;
}
.menu-container {
  width: 480px;
}
.card-header {
  font-size: 18px;
  font-weight: bold;
}
.table-option {
  display: flex;
}
</style>

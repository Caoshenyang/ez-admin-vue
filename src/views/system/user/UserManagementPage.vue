<script lang="ts" setup>
import { deptApi } from '@/api/system/dept'
import { userApi } from '@/api/system/user'
import type { PageQuery, PageVO, Tree } from '@/types/common'
import type { DeptTreeVO, RoleListVO, UserForm, UserListVO, UserQuey } from '@/types/system'
import { INIT_USER_QUERY, defaultProps } from './data'
import { StatusEnum } from '@/enums/appEnums'
import { roleApi } from '@/api/system/role'

const filterText = ref('')

const deptTreeRef = ref() // 左侧树形控件ref
const deptTreeData = ref<DeptTreeVO[]>() // 部门树形数据

const userTableRef = ref() // 表格ref
const userTabData = ref<PageVO<UserListVO>>() // 用户表格数据

const formTitle = ref('') // 表单标题
const userFormRef = ref() // 表单ref
const userFormData = ref<UserForm>() // 表单数据

const userFormDialogRef = ref() // 表单弹窗ref

const roleSelectList = ref<RoleListVO[]>([])

/** 查询对象 */
const userQuery = reactive<PageQuery<UserQuey>>({ ...INIT_USER_QUERY })

onMounted(() => {
  refreshList()
})

// 刷新列表
const refreshList = async () => {
  // 加载部门树，左侧展示和新建时选择部门是需要使用
  deptTreeData.value = await deptApi.getDeptTreeList()
  // 加载用户列表
  userTabData.value = await userApi.getUserList(userQuery)
}

// 新增
const handleAddOrEdit = async (userId?: string) => {
  // 设置表单标题  deptId存在则为编辑操作
  formTitle.value = userId ? '编辑' : '新增' + '用户'

  // 初始化表单数据
  if (userId) {
    const data = await userApi.getUserById(userId)
    userFormData.value = { ...data }
  } else {
    // 新增啥也不做，给一些默认值
    userFormData.value = { gender: 3, status: 1 }
  }

  // 加载角色数据
  // todo: 这里后续需要优化，暂时直接使用类别的接口，其实应该区分开，只能选择启用的角色
  roleSelectList.value = await roleApi.getRoleList()

  // 打开弹窗
  userFormDialogRef.value.open()
}

/**
 * 删除
 * @param isBatch 是否批量删除
 * @param row 删除行
 */
const handleDelete = (isBatch: boolean, id?: string) => {
  console.log(isBatch, id)
}

// 新增、编辑保存
const handleConfirm = async () => {
  await userFormRef.value.validate()
  const formData = userFormRef.value.getData()
  if (formData.userId) {
    await userApi.updateUser(formData)
  } else {
    await userApi.createUser(formData)
  }
  userFormDialogRef.value.close()
  refreshList()
}

const handleSizeChange = (pageSize: number) => {
  userQuery.pageSize = pageSize
  refreshList()
}
const handleCurrentChange = (pageNum: number) => {
  userQuery.pageNum = pageNum
  refreshList()
}

watch(filterText, (val) => {
  // filter	过滤所有树节点，过滤后的节点将被隐藏	接收一个参数并指定为 filter-node-method 属性的第一个参数
  deptTreeRef.value!.filter(val)
})

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.deptName.includes(value)
}

const handleNodeClick = (data: DeptTreeVO) => {
  userQuery.search!.deptId = data.deptId
  refreshList()
}
</script>
<template>
  <div>
    <el-row :gutter="20" class="user-management-content">
      <el-col :span="4">
        <div class="dept-list">
          <el-input class="search-box" v-model="filterText" clearable placeholder="输入部门名称搜索">
            <template #prefix>
              <EZSvgIcon icon="ep:search"></EZSvgIcon>
            </template>
          </el-input>
          <el-tree
            ref="deptTreeRef"
            class="filter-tree"
            :data="deptTreeData"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20">
        <div class="user-list">
          <div class="search-bar">搜索区域</div>
          <div class="operation-bar">
            <div class="operation-button">
              <el-button type="primary" plain @click="handleAddOrEdit()">
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
              <el-table
                :data="userTabData?.records"
                ref="userTableRef"
                stripe
                height="100%"
                highlight-current-row
                row-key="userId"
              >
                <!-- 选项 -->
                <el-table-column type="selection" width="55" />
                <!-- 序号 -->
                <el-table-column type="index" width="80" label="序号" />
                <!-- 用户账号 -->
                <el-table-column prop="username" label="账号" />
                <!-- 用户昵称 -->
                <el-table-column prop="nickname" label="昵称" />
                <!-- 用户头像 -->
                <el-table-column prop="avatar" label="头像">
                  <template #default="{ row }">
                    <el-avatar
                      :size="30"
                      :src="row.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
                    />
                  </template>
                </el-table-column>
                <!-- 用户部门 -->
                <el-table-column prop="deptName" label="部门" />
                <!-- 用户状态 -->
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="scope">
                    <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                      {{ StatusEnum[scope.row.status] }}
                    </el-tag>
                  </template>
                </el-table-column>
                <!-- 创建时间 -->
                <el-table-column prop="createTime" label="创建时间" />
                <el-table-column label="操作" fixed="right" width="180">
                  <template #default="scope">
                    <div class="table-option">
                      <el-button
                        type="success"
                        :disabled="scope.row.roleLabel === 'admin'"
                        plain
                        @click.stop="handleAddOrEdit(scope.row.userId)"
                      >
                        <template #icon>
                          <EZSvgIcon icon="ep:edit-pen" />
                        </template>
                      </el-button>
                      <el-button
                        type="danger"
                        :disabled="scope.row.roleLabel === 'admin'"
                        plain
                        @click.stop="handleDelete(false, scope.row.userId)"
                      >
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
                  v-model:current-page="userQuery.pageNum"
                  v-model:page-size="userQuery.pageSize"
                  :page-sizes="[15, 30, 45, 60]"
                  :background="false"
                  layout="total, prev, pager, next, sizes"
                  :total="userTabData?.total || 0"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </template>
            </el-card>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 表单弹框 -->
    <EZFormDialog ref="userFormDialogRef" :title="formTitle" width="30%" @confirm="handleConfirm">
      <UserForm ref="userFormRef" :form-data="userFormData" :dept-tree="deptTreeData" :role-list="roleSelectList" />
    </EZFormDialog>
  </div>
</template>

<style lang="scss" scoped>
.dept-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  .search-box {
    margin-bottom: 10px;
  }
  .filter-tree {
    flex: 1;
    overflow-y: auto;
  }
}
</style>

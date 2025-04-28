<script lang="ts" setup>
import type { DeptForm, DeptQuery, DeptTreeVO } from '@/types/system'
import { INIT_DEPT_TREE_DATA, INIT_FORM_DATA, INIT_QUERY, FILTERS, ACTION_BUTTONS, FORM_FIELDS } from './config'
import { deptApi } from '@/api/system/dept'
import { msgErr, msgInfo, msgSuccess } from '@/utils/message'
import { useButtonActions } from '@/composables/useButtonActions'
import { Plus, EditPen, Delete } from '@element-plus/icons-vue'

const deptTableTreeData = ref<DeptTreeVO[]>([]) // 表格树形数据
const loading = ref(false) // 列表加载状态
const actionBarRef = ref() // 操作栏 ref
const dialogVisible = ref(false) // 弹窗显示状态
const currentId = ref<string>() // 当前操作行的 id
const selectedRows = ref<DeptTreeVO[]>([]) // 选中的行数据
const formData = ref<DeptForm>({ ...INIT_FORM_DATA }) // 表单数据
const deptSelectOptions = ref<DeptTreeVO[]>([{ ...INIT_DEPT_TREE_DATA }]) // 下拉树形数据
const formFields = ref([...FORM_FIELDS]) // 初始化表单字段
const deptQuery = ref<DeptQuery>({ ...INIT_QUERY }) // 初始化查询对象

// 动态计算按钮状态
const actionButtons = computed(() => {
  return useButtonActions(ACTION_BUTTONS, selectedRows)
})

// 刷新列表
const refreshList = async () => {
  loading.value = true
  // 重制一些状态
  currentId.value = ''
  selectedRows.value = []
  deptQuery.value = { ...INIT_QUERY }
  actionBarRef.value.handleReset()
  await handleSearch(deptQuery.value)
  loading.value = false
}

onMounted(() => {
  refreshList()
})

/**
 * 加载部门树选择数据
 */
const loadDeptTreeSelect = async () => {
  const deptTreeSelect = await deptApi.getDeptTreeList()
  deptSelectOptions.value = [
    {
      ...deptSelectOptions.value[0],
      children: [...deptTreeSelect]
    }
  ]
  // 动态表单中的部门选择数据赋值
  formFields.value = formFields.value.map((field) =>
    field.prop === 'parentId' ? { ...field, props: { ...field.props, data: [...deptSelectOptions.value] } } : field
  )
}

/**
 * 初始化新增表单
 * @param parentId 父部门ID
 */
const initAddForm = async (parentId?: string) => {
  formData.value = { ...INIT_FORM_DATA, parentId: parentId || INIT_FORM_DATA.parentId }
  await loadDeptTreeSelect()
  dialogVisible.value = true
}

/**
 * 初始化编辑表单
 * @param deptId 部门ID
 */
const initEditForm = async (deptId: string) => {
  const data = await deptApi.getDeptById(deptId)
  formData.value = { ...data }
  await loadDeptTreeSelect()
  dialogVisible.value = true
}

// 新增顶级部门
const handleAdd = () => {
  currentId.value = ''
  initAddForm()
}

// 新增子部门
const handleAddChildren = async (row: DeptTreeVO) => {
  if (!row.status) {
    msgErr('该节点未启用，无法添加子部门')
    return
  }
  currentId.value = ''
  await initAddForm(row.deptId)
}

// 编辑部门
const handleEdit = () => {
  if (selectedRows.value.length === 1) {
    currentId.value = selectedRows.value[0].deptId
    initEditForm(currentId.value)
  }
}

// 操作栏删除按钮使用批量删除接口
const handleDelete = () => {
  if (selectedRows.value.length === 0) {
    msgErr('请选择要删除的部门')
  }
  // 如果不是批量删除，给删除id赋值
  ElMessageBox.confirm(`确定要删除选中的部门吗？`, '删除提醒', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 获取所有选择menuId
      const deleteDeptIdList = selectedRows.value.map((item) => item.deptId)
      // 调用接口删除用户
      await deptApi.deleteBatchDept(deleteDeptIdList)
      msgSuccess('删除成功')
      refreshList()
    })
    .catch(() => {
      msgInfo('已取消删除')
    })
}

// 删除指定节点
const handleDeleteNode = async (row: DeptTreeVO) => {
  await deptApi.deleteDept(row.deptId)
  msgSuccess('删除成功')
  refreshList()
}

// 切换部门状态
const handleStatusChange = async (status: number, deptId: string) => {
  await deptApi.updateDept({ deptId, status })
  msgSuccess('操作成功')
}

// 搜索部门
const handleSearch = async (params: DeptQuery) => {
  deptQuery.value = { ...params }
  const data = await deptApi.getDeptList(deptQuery.value)
  deptTableTreeData.value = [...data]
}

// 表单确认提交
const handleConfirm = async (formData: DeptForm) => {
  if (currentId.value) {
    await deptApi.updateDept(formData)
  } else {
    await deptApi.createDept(formData)
  }
  dialogVisible.value = false
  refreshList()
}

// 所有操作的处理函数
const actionHandlers = {
  refresh: refreshList,
  add: handleAdd,
  edit: handleEdit,
  delete: () => handleDelete()
}

// 调用方式
const handleAction = (actionName: keyof typeof actionHandlers) => {
  actionHandlers[actionName]?.()
}
</script>
<template>
  <div class="menu-container">
    <AppActionBar
      ref="actionBarRef"
      :filters="FILTERS"
      :actions="actionButtons"
      :selectedRows="selectedRows"
      @search="handleSearch"
      @action="handleAction"
    />
    <div class="table-container">
      <el-table
        max-height="580px"
        v-loading="loading"
        stripe
        highlight-current-row
        :data="deptTableTreeData"
        row-key="deptId"
        default-expand-all
        @selection-change="(val) => (selectedRows = val)"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="deptName" label="部门名称" />
        <el-table-column prop="deptSort" label="排序" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange($event as number, scope.row.deptId)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="description" label="描述" />

        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <div class="table-option">
              <el-button type="primary" :icon="Plus" plain @click="handleAddChildren(scope.row)" />
              <el-button type="success" :icon="EditPen" plain @click="initEditForm(scope.row.deptId)" />
              <el-button type="danger" :icon="Delete" plain @click="handleDeleteNode(scope.row)" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 表单对话框 -->
    <EZFormDialog
      v-model:visible="dialogVisible"
      :initial-data="formData"
      :title="currentId ? '编辑部门' : '新增部门'"
      :fields="formFields"
      @confirm="handleConfirm"
    />
  </div>
</template>

<style lang="scss" scoped></style>

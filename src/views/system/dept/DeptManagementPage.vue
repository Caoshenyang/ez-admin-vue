<script lang="ts" setup>
import type { DeptForm, DeptQuery, DeptTreeVO } from '@/types/system'
import { INIT_DEPT_TREE_DATA, INIT_FORM_DATA, INIT_QUERY, FILTERS, ACTION_BUTTONS, FORM_FIELDS } from './data'
import { deptApi } from '@/api/system/dept'
import { msgErr, msgSuccess } from '@/utils/message'

const deptTableTreeData = ref<DeptTreeVO[]>([]) // 表格树形数据
const loading = ref(false) // 列表加载状态
const actionBarRef = ref() // 操作栏 ref
const dialogVisible = ref(false) // 弹窗显示状态
const currentId = ref<string>() // 当前操作行的 id

const selectedRows = ref<DeptTreeVO[]>([]) // 选中的行数据
const formData = ref<DeptForm>({ ...INIT_FORM_DATA }) // 表单数据
const deptSelectOptions = ref<DeptTreeVO[]>([{ ...INIT_DEPT_TREE_DATA }]) // 下拉树形数据

// 初始化表单字段
const formFields = ref([...FORM_FIELDS])
// 查询对象
const deptQuery = ref<DeptQuery>({ ...INIT_QUERY })

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

refreshList()

/**
 * 初始化表单
 * deptId: 部门id parentId: 父部门id
 * 有deptId则为编辑操作
 * 有parentId则为新增子节点操作
 * @param options { deptId?: string; parentId?: string }
 */
const initDeptForm = async (options: { deptId?: string; parentId?: string } = {}) => {
  // 有deptId则为编辑操作
  if (options.deptId) {
    const data = await deptApi.getDeptById(options.deptId)
    formData.value = { ...data }
  } else {
    formData.value = { ...INIT_FORM_DATA, parentId: options.parentId || INIT_FORM_DATA.parentId }
  }

  // 加载部门树数据
  const deptTreeSelect = await deptApi.getDeptTreeList()
  deptSelectOptions.value = [
    {
      ...deptSelectOptions.value[0], // 保留其他属性
      children: [...deptTreeSelect] // 浅拷贝数组（避免引用共享）
    }
  ]
  // 设置选择控件表单字段
  formFields.value = formFields.value.map((field) =>
    field.prop === 'parentId' ? { ...field, props: { ...field.props, data: [...deptSelectOptions.value] } } : field
  )
  dialogVisible.value = true
}

// 使用计算属性或函数扩展按钮配置
const actionButtons = computed(() => {
  // 根据按钮名称获取按钮禁用状态
  return ACTION_BUTTONS.map((button) => ({
    ...button,
    disabled: getButtonDisabledState(button.name)
  }))
})

function getButtonDisabledState(name: string): boolean {
  switch (name) {
    case 'add':
      return true
    case 'edit':
      return selectedRows.value.length !== 1
    case 'delete':
      return selectedRows.value.length === 0
    default:
      return false
  }
}

// 新增
const handleAdd = () => {
  initDeptForm()
}

const handleEdit = () => {
  initDeptForm({ deptId: currentId.value })
}

const handleDelete = () => {
  console.log('handleDelete', selectedRows.value)
  console.log('currentId', currentId.value)

  // // 如果不是批量删除，给删除id赋值
  // ElMessageBox.confirm(isBatch ? `确定要删除选中的部门吗？` : `确定要删除该部门吗？`, '删除提醒', {
  //   confirmButtonText: '确定',
  //   cancelButtonText: '取消',
  //   type: 'warning'
  // })
  //   .then(async () => {
  //     if (!isBatch && deptId) {
  //       // 调用接口删除菜单
  //       await deptApi.deleteDept(deptId)
  //     } else {
  //       // 获取所有选择menuId
  //       const deleteDeptIdList = selectedRows.value.map((item) => item.deptId)
  //       // 调用接口删除用户
  //       await deptApi.deleteBatchDept(deleteDeptIdList)
  //     }
  //     msgSuccess('删除成功')
  //     refreshList()
  //   })
  //   .catch(() => {
  //     msgInfo('已取消删除')
  //   })
}

/**
 * 新增子节点
 */
const handleAddChildren = async (row: DeptTreeVO) => {
  // 未开启的节点无法直接添加子节点
  if (!row.status) {
    msgErr('该节点未启用，无法添加子节点')
    return
  }
  await initDeptForm({ parentId: row.deptId })
}

// 所有操作的处理函数
const actionHandlers = {
  refresh: refreshList,
  add: handleAdd,
  edit: handleEdit,
  delete: handleDelete
}

// 调用方式
const handleAction = (actionName: keyof typeof actionHandlers, payload?: DeptForm) => {
  if (payload) {
    currentId.value = payload.deptId
  }
  actionHandlers[actionName]?.()
}

const handleConfirm = async (formData: DeptForm) => {
  if (currentId.value) {
    await deptApi.updateDept(formData)
  } else {
    await deptApi.createDept(formData)
  }
  dialogVisible.value = false
  refreshList()
}

// 切换部门启动状态
const handleStatusChange = async (status: number, deptId: string) => {
  await deptApi.updateDept({ deptId, status })
  msgSuccess('操作成功')
}

const handleSearch = async (params: DeptQuery) => {
  deptQuery.value = { ...params }
  const data = await deptApi.getDeptList(deptQuery.value)
  deptTableTreeData.value = [...data]
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
              <el-button type="primary" plain @click="handleAddChildren(scope.row)">
                <template #icon>
                  <EZSvgIcon icon="ep:plus" />
                </template>
              </el-button>
              <el-button type="success" plain @click="handleAction('edit', scope.row)">
                <template #icon>
                  <EZSvgIcon icon="ep:edit-pen" />
                </template>
              </el-button>
              <el-button type="danger" plain @click="handleDelete()">
                <template #icon>
                  <EZSvgIcon icon="ep:delete" />
                </template>
              </el-button>
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

<script lang="ts" setup>
import type { DeptForm, DeptQuery, DeptTreeVO } from '@/types/system'
import { INIT_DEPT_TREE_DATA, INIT_FORM_DATA, INIT_QUERY } from './data'
import { deptApi } from '@/api/system/dept'
import { msgErr, msgInfo, msgSuccess } from '@/utils/message'

const deptTableTreeData = ref<DeptTreeVO[]>([]) // 表格树形数据
const deptFormDialogRef = ref() // 表单弹窗 ref
const deptFormRef = ref() // 表单 ref
const formTitle = ref('') // 表单弹窗标题
const selectedRows = ref<DeptTreeVO[]>([]) // 选中的行数据
const formData = ref<DeptForm>({ ...INIT_FORM_DATA }) // 表单数据
const deptSelectOptions = ref<DeptTreeVO[]>([{ ...INIT_DEPT_TREE_DATA }]) // 下拉树形数据

onMounted(() => {
  refreshList()
})

/** 查询对象 */
const deptQuery = reactive<DeptQuery>({ ...INIT_QUERY })

// 刷新列表
const refreshList = async () => {
  const data = await deptApi.getDeptList(deptQuery)
  deptTableTreeData.value = data
}

// 新增
const handleAdd = async () => {
  initDeptForm()
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

  await initDeptForm({ parentId: row.parentId })
}

/**
 * 编辑
 * @param id menuId
 */
const handleEdit = async (deptId: string) => {
  initDeptForm({ deptId })
}

/**
 * 初始化表单
 * deptId: 部门id parentId: 父部门id
 * 有deptId则为编辑操作
 * 有parentId则为新增子节点操作
 * @param options { deptId?: string; parentId?: string }
 */
const initDeptForm = async (options: { deptId?: string; parentId?: string } = {}) => {
  // 设置表单标题  deptId存在则为编辑操作
  formTitle.value = options.deptId ? '编辑部门' : '新增部门'

  // 初始化表单数据，可覆盖parentId
  if (options.deptId) {
    const data = await deptApi.getDeptById(options.deptId)
    formData.value = { ...data }
  } else {
    console.log(options.parentId)

    formData.value = {
      ...INIT_FORM_DATA,
      parentId: options.parentId || INIT_FORM_DATA.parentId
    }
  }

  // 加载部门树数据
  const deptTreeSelect = await deptApi.getDeptTreeList()
  deptSelectOptions.value[0].children = deptTreeSelect

  // 打开弹窗
  deptFormDialogRef.value.open()
}

const handleConfirm = async () => {
  try {
    await deptFormRef.value.validate()
    const formData = deptFormRef.value.getData()
    if (formData.deptId) {
      await deptApi.updateDept(formData)
    } else {
      await deptApi.createDept(formData)
    }
    deptFormDialogRef.value.close()
    refreshList()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

/**
 * 删除
 * @param isBatch 是否批量删除
 * @param row 删除行
 */
const handleDelete = (isBatch: boolean, deptId?: string) => {
  // 如果不是批量删除，给删除id赋值
  ElMessageBox.confirm(isBatch ? `确定要删除选中的部门吗？` : `确定要删除该部门吗？`, '删除提醒', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      if (!isBatch && deptId) {
        // 调用接口删除菜单
        await deptApi.deleteDept(deptId)
      } else {
        // 获取所有选择menuId
        const deleteDeptIdList = selectedRows.value.map((item) => item.deptId)
        // 调用接口删除用户
        await deptApi.deleteBatchDept(deleteDeptIdList)
      }
      msgSuccess('删除成功')
      refreshList()
    })
    .catch(() => {
      msgInfo('已取消删除')
    })
}
// 切换部门启动状态
const handleStatusChange = async (status: number, deptId: string) => {
  await deptApi.updateDept({ deptId, status })
  msgSuccess('操作成功')
}

const handleSelectionChange = (val: DeptTreeVO[]) => {
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
        highlight-current-row
        :data="deptTableTreeData"
        row-key="deptId"
        default-expand-all
        @selection-change="handleSelectionChange"
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
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <div class="table-option">
              <el-button type="primary" plain @click="handleAddChildren(scope.row)">
                <template #icon>
                  <EZSvgIcon icon="ep:plus" />
                </template>
              </el-button>
              <el-button type="success" plain @click="handleEdit(scope.row.deptId)">
                <template #icon>
                  <EZSvgIcon icon="ep:edit-pen" />
                </template>
              </el-button>
              <el-button type="danger" plain @click="handleDelete(false, scope.row.deptId)">
                <template #icon>
                  <EZSvgIcon icon="ep:delete" />
                </template>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 使用更清晰的 visible 属性 -->
    <EZFormDialog ref="deptFormDialogRef" :title="formTitle" width="30%" @confirm="handleConfirm">
      <DeptForm ref="deptFormRef" :form-data="formData" :deptTree="deptSelectOptions" />
    </EZFormDialog>
  </div>
</template>

<style lang="scss" scoped></style>

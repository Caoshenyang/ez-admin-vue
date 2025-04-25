<script lang="ts" setup>
import { roleApi } from '@/api/system/role'
import type { RoleForm } from '@/types/system'
import type { FormRules } from 'element-plus'

const INIT_FORM: RoleForm = {
  roleId: '',
  roleName: '',
  roleLabel: '',
  dataScope: 1,
  roleSort: 0,
  status: 0,
  description: ''
}

const emits = defineEmits(['confirm'])
const visible = ref<boolean>(false) // 是否显示
const title = ref<string>('新增角色') // 标题
const roleFormRef = ref() // 表单实例
const roleFormData = ref<RoleForm>({ ...INIT_FORM }) // 表单数据
const loading = ref(false) // 提交按钮加载状态

const dataScopeOptions = [
  { label: '仅本人数据权限', value: 1 },
  { label: '本部门数据权限', value: 2 },
  { label: '本部门及以下数据权限', value: 3 },
  { label: '自定数据权限', value: 4 },
  { label: '全部数据权限', value: 5 }
]

const rules = reactive<FormRules<typeof roleFormData>>({
  roleName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  roleLabel: [{ required: true, message: '标识不能为空', trigger: 'blur' }],
  dataScope: [{ required: true, message: '数据权限不能为空', trigger: 'blur' }]
})

const open = async (roleId?: string) => {
  visible.value = true
  if (roleId) {
    title.value = '编辑角色'
    roleFormData.value = await roleApi.getRoleById(roleId)
  } else {
    title.value = '新增角色'
    resetForm()
  }
}

const resetForm = () => {
  roleFormRef.value?.resetFields()
  roleFormRef.value = { ...INIT_FORM }
}

const close = () => {
  visible.value = false
}

const handleSubmit = async () => {
  if (!roleFormRef.value) return

  try {
    const isValid = await roleFormRef.value.validate()
    if (!isValid) return

    loading.value = true

    if (!roleFormData.value.roleId) {
      await roleApi.createRole(roleFormData.value)
    } else {
      await roleApi.updateRole(roleFormData.value)
    }

    close()
    emits('confirm')
  } catch (error) {
    console.error('表单提交失败:', error)
  } finally {
    loading.value = false
  }
}

defineExpose({ open })
</script>
<template>
  <div>
    <el-dialog class="dialog-container" v-model="visible" @closed="resetForm" :close-on-click-modal="false">
      <template #header>{{ title }}</template>
      <el-form label-width="auto" class="dialog-body" ref="roleFormRef" :model="roleFormData" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleFormData.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色标识" prop="roleLabel">
          <el-input v-model="roleFormData.roleLabel" placeholder="请输入角色标识" />
        </el-form-item>
        <el-form-item label="排序" prop="roleSort">
          <el-input-number v-model="roleFormData.roleSort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="roleFormData.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 数据权限 -->
        <el-form-item label="数据权限" prop="dataScope">
          <el-select v-model="roleFormData.dataScope" placeholder="请选择数据权限">
            <el-option v-for="item in dataScopeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <!-- 描述信息 -->
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="roleFormData.description" placeholder="请输入描述信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close" :disabled="loading">取消</el-button>
          <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
:deep(.dialog-container) {
  // 禁止光标选择
  user-select: none;
  width: 540px;
}
.dialog-body {
  padding: 20px;
}
</style>

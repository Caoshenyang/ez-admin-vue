<script lang="ts" setup>
import type { DeptTreeVO, RoleListVO, UserForm } from '@/types/system'
import { treeProps } from '../dept/data'
import type { FormRules } from 'element-plus'

const props = defineProps({
  formData: { type: Object as PropType<UserForm>, default: () => ({}) },
  deptTree: { type: Array as PropType<DeptTreeVO[]>, default: () => [] },
  roleList: { type: Array as PropType<RoleListVO[]>, default: () => [] }
})

const genderOptions = [
  { label: '保密', value: 0 },
  { label: '男', value: 1 },
  { label: '女', value: 2 }
]

const formRef = ref()
const form = ref({ ...props.formData })
// 深度监听 prop 变化
watch(
  () => props.formData,
  (newVal) => {
    form.value = { ...newVal }
  },
  { deep: true }
)
const rules = reactive<FormRules<typeof form>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
  phoneNumber: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
})

defineExpose({
  validate: () => formRef.value.validate(),
  getData: () => form.value,
  resetFields: () => (form.value = { ...props.formData })
})
</script>
<template>
  <div>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="60px">
      <!-- 分成左右两列 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <!-- 账号编辑时只读，不让修改 -->
          <el-form-item label="账号" prop="username" v-if="!form.userId">
            <el-input v-model="form.username" placeholder="请输入账号"></el-input>
          </el-form-item>
          <!-- 昵称 -->
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <!-- 性别 -->
          <el-form-item label="性别" prop="gender">
            <el-select v-model="form.gender" placeholder="请选择性别">
              <el-option v-for="item in genderOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码" prop="password" v-if="!form.userId">
            <el-input v-model="form.password" placeholder="请输入密码" type="password"></el-input>
          </el-form-item>
          <!-- 部门 -->
          <el-form-item label="部门" prop="deptId">
            <el-tree-select placeholder="请选择部门" v-model="form.deptId" :data="deptTree" :props="treeProps" />
          </el-form-item>
          <!-- 手机号 -->
          <el-form-item label="手机" prop="phoneNumber">
            <el-input v-model="form.phoneNumber" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <!-- 状态 -->
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :value="0">禁用</el-radio>
              <el-radio :value="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 角色 -->
      <el-form-item label="角色" prop="roleIds">
        <el-select v-model="form.roleIds" placeholder="请选择角色" multiple>
          <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
        </el-select>
      </el-form-item>
      <!-- 描述 -->
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" placeholder="请输入描述"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped></style>

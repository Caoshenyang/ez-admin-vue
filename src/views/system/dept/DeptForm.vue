<script lang="ts" setup>
import type { DeptForm, DeptTreeVO } from '@/types/system'
import type { FormRules } from 'element-plus'
import { INIT_DEPT_TREE_DATA, treeProps } from './data'

const props = defineProps({
  formData: { type: Object as PropType<DeptForm>, default: () => ({}) },
  deptTree: { type: Array as PropType<DeptTreeVO[]>, default: () => [{ ...INIT_DEPT_TREE_DATA }] }
})

const formRef = ref()
const form = ref({ ...props.formData })

const rules = reactive<FormRules<typeof form>>({
  deptName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  parentId: [{ required: true, message: '上级部门不能为空', trigger: 'blur' }],
  deptSort: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
})

const handParentChange = (node: DeptTreeVO) => {
  form.value.ancestors = node.deptId !== '0' ? `${node.ancestors},${node.deptId}` : '0'
}

defineExpose({
  validate: () => formRef.value.validate(),
  getData: () => form.value
})
</script>
<template>
  <div>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="form.deptName" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item label="上级部门" prop="parentId" style="width: 100%">
        <el-tree-select
          placeholder="请选择上级部门"
          v-model="form.parentId"
          @node-click="handParentChange"
          check-strictly
          :data="deptTree"
          :props="treeProps"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :value="1">正常</el-radio>
          <el-radio :value="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="deptSort">
        <el-input-number v-model="form.deptSort" :min="0" :max="999" />
      </el-form-item>
      <!-- 描述信息 -->
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="form.description" placeholder="请输入描述信息" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  font-weight: bold;
}
:deep(.el-select) {
  font-weight: bold;
}
</style>

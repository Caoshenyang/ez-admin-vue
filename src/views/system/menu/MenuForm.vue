<!-- 新增编辑表单 -->
<script lang="ts" setup>
import { createMenuApi, getMenuByIdApi, selectMenuTreeApi, updateMenuApi } from '@/api/system/menu';
import type { MenuForm, MenuTreeVO } from '@/types/system';
import type { FormInstance, FormRules } from 'element-plus';

const initForm = {
  menuId: "",
  menuName: "",
  menuIcon: "",
  menuLabel: "",
  parentId: "",
  menuSort: 0,
  menuType: 1,
  menuPerm: "",
  status: 0
}

const emits = defineEmits(['confirm'])
const visible = ref<boolean>(false)  // 是否显示
const title = ref<string>('新增菜单') // 标题
const menuFormData = ref<MenuForm>(initForm) // 菜单表单值
const menuFormRef = ref<FormInstance>()
const rules = reactive<FormRules<typeof menuFormData>>({
  menuName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
})

// 选择父组件值
const seletMenuData = ref<MenuTreeVO[]>([
  {
    menuId: '0',
    parentId: '0',
    menuName: '顶级菜单',
    children: []
  }
])

// 树型节点类型
const treeProps = {
  children: 'children',
  label: 'menuName',
  value: 'menuId'
}

// 菜单类型
const menuTypeOptions = ref([
  { label: '目录', value: 1 },
  { label: '菜单', value: 2 },
  { label: '按钮', value: 3 }
])

// 通过计算属性动态控制，菜单的标题
const menuNameLabel = computed(() => {
  return menuFormData.value.menuType === 3 ? '按钮名称' : '菜单名称'
})

// 处理编辑逻辑
const handleEdit = async (menuId: number) => {
  await getMenuByIdApi(menuId).then((res) => {
    menuFormData.value = res
  })
}

// 重置表单
const resetForm = () => {
  menuFormRef.value?.resetFields()
}

const open = async (menuId?: number) => {
  // 获取菜单列表
  seletMenuData.value[0].children = await selectMenuTreeApi()
  visible.value = true
  // 编辑时，获取数据，回显
  if (menuId) {
    title.value = '编辑菜单'
    handleEdit(menuId)
  }
}

const close = () => {
  visible.value = false
}

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  const isValid = await formEl.validate();

  if (!isValid) return;

  if (menuFormData.value.menuId === null) {
    await saveMenu();
  } else {
    await updateMenu();
  }
}



// 新增用户
const saveMenu = async () => {
  // 禁用按钮
  await createMenuApi(menuFormData.value)
    .then(() => {
      close() // 关闭窗口
      emits('confirm') // 通知父组件保存成功
    })
    .finally(() => {
      // 解除禁用
    })
}
// 编辑用户
const updateMenu = async () => {
  // 禁用按钮
  await updateMenuApi(menuFormData.value)
    .then(() => {
      close() // 关闭窗口
      emits('confirm') // 通知父组件保存成功
    })
    .finally(() => {
      // 解除禁用
    })
}

defineExpose({ open })
</script>
<template>
  <div>
    <el-dialog class="dialog-container" v-model="visible" :title="title" width="40%" @closed="resetForm">
      <el-form label-width="auto" class="dialog-body" ref="menuFormRef" :model="menuFormData" :rules="rules">
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group class="menu-type" v-model="menuFormData.menuType">
            <el-radio-button v-for="(item, index) in menuTypeOptions" :key="index" :label="item.label"
              :value="item.value" />
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="menuFormData.menuType !== 3" prop="icon" label="菜单图标">
          <el-input v-model="menuFormData.menuIcon" placeholder="菜单图标" />
        </el-form-item>
        <!-- 分两列展示 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="menuName" :label="menuNameLabel">
              <el-input v-model="menuFormData.menuName" placeholder="菜单名称" />
            </el-form-item>
            <!-- <el-form-item v-if="menuFormData.menuType !== 3" prop="path" label="路由地址">
              <el-input v-model="menuFormData.path" placeholder="路由地址" />
            </el-form-item> -->
          </el-col>
          <el-col :span="12">
            <el-form-item prop="sort" label="菜单排序">
              <el-input-number style="width: 100%" v-model="menuFormData.menuSort" controls-position="right" />
            </el-form-item>
            <!-- <el-form-item prop="component" v-if="menuFormData.menuType !== 3" label="组件名称">
              <el-input :disabled="menuFormData.menuType !== 2" v-model="menuFormData.component" placeholder="组件名称" />
            </el-form-item> -->
          </el-col>
        </el-row>
        <el-form-item prop="perms" label="权限标识">
          <el-input v-model="menuFormData.menuPerm" placeholder="权限标识" />
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId" style="width: 100%">
          <el-tree-select popper-class="menu-tree-popper" v-model="menuFormData.parentId" :data="seletMenuData"
            check-strictly :props="treeProps" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="handleSubmit(menuFormRef)">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>


<style lang="scss" scoped></style>

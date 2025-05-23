<!-- 新增编辑表单 -->
<script lang="ts" setup>
import { menuApi } from '@/api/system/menu'
import type { MenuForm, MenuTreeVO } from '@/types/system'
import type { FormInstance, FormRules } from 'element-plus'

// 类型定义
interface MenuTypeOption {
  label: string
  value: number
}

// 常量定义
const MENU_TYPE_OPTIONS: MenuTypeOption[] = [
  { label: '目录', value: 1 },
  { label: '菜单', value: 2 },
  { label: '按钮', value: 3 }
]

// 树型节点类型
const treeProps = {
  children: 'children',
  label: 'menuName',
  value: 'menuId'
}

const ROOT_MENU: MenuTreeVO = {
  menuId: '0',
  parentId: '0',
  menuName: '顶级菜单',
  children: []
}

const INIT_FORM: MenuForm = {
  menuId: '',
  menuName: '',
  menuIcon: '',
  parentId: '0',
  menuSort: 0,
  menuType: 1,
  menuPerm: '',
  routePath: '',
  routeName: '',
  componentPath: '',
  buttonEvent: '',
  buttonStyle: '',
  status: 0,
  visible: 1
}

const emits = defineEmits(['confirm'])
const visible = ref<boolean>(false) // 是否显示
const title = ref<string>('新增菜单') // 标题
const menuFormData = ref<MenuForm>({ ...INIT_FORM }) // 菜单表单值
const seletMenuData = ref<MenuTreeVO[]>([{ ...ROOT_MENU }]) // 选择父组件值
const loading = ref(false)
const menuFormRef = ref<FormInstance>()

const rules = reactive<FormRules<typeof menuFormData>>({
  menuName: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
})

// 通过计算属性动态控制，菜单的标题
const menuNameLabel = computed(() => {
  return menuFormData.value.menuType === 3 ? '按钮名称' : '菜单名称'
})

// 方法定义
const loadMenuTree = async () => {
  seletMenuData.value[0].children = await menuApi.selectMenuTree()
}

const resetForm = () => {
  menuFormRef.value?.resetFields()
  menuFormData.value = { ...INIT_FORM }
}

const open = async (menuId?: string) => {
  await loadMenuTree()
  visible.value = true
  if (menuId) {
    title.value = '编辑菜单'
    menuFormData.value = await menuApi.getMenuById(menuId)
  } else {
    title.value = '新增菜单'
    resetForm()
  }
}

/** 添加子节点 */
const addChildren = async (menuId: string) => {
  await loadMenuTree()
  visible.value = true
  title.value = '新增菜单'
  resetForm()
  menuFormData.value.parentId = menuId
}

const close = () => {
  visible.value = false
}

const handleSubmit = async () => {
  if (!menuFormRef.value) return

  try {
    const isValid = await menuFormRef.value.validate()
    if (!isValid) return

    loading.value = true

    if (!menuFormData.value.menuId) {
      await menuApi.createMenu(menuFormData.value)
    } else {
      await menuApi.updateMenu(menuFormData.value)
    }

    close()
    emits('confirm')
  } catch (error) {
    console.error('表单提交失败:', error)
  } finally {
    loading.value = false
  }
}

defineExpose({ open, addChildren, close })
</script>
<template>
  <div>
    <el-dialog class="dialog-container" v-model="visible" @closed="resetForm" :close-on-click-modal="false">
      <template #header>{{ title }}</template>
      <el-form label-width="auto" class="dialog-body" ref="menuFormRef" :model="menuFormData" :rules="rules">
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group class="menu-type" v-model="menuFormData.menuType">
            <el-radio-button
              v-for="(item, index) in MENU_TYPE_OPTIONS"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId" style="width: 100%">
          <el-tree-select
            popper-class="menu-tree-popper"
            v-model="menuFormData.parentId"
            :data="seletMenuData"
            check-strictly
            :props="treeProps"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item prop="menuIcon">
          <template #label>
            <div class="menu-label-notice">
              <el-tooltip placement="bottom" effect="light">
                <EZSvgIcon icon="ep:question-filled" />
                <template #content>
                  在以下站点选择图标:
                  <br />
                  <el-link href="https://icon-sets.iconify.design/" target="_blank">
                    https://icon-sets.iconify.design/
                  </el-link>
                  <br />
                  <el-link href="https://icones.js.org/" target="_blank"> https://icones.js.org/ </el-link>
                </template>
              </el-tooltip>
              菜单图标
            </div>
          </template>
          <el-input v-model="menuFormData.menuIcon" placeholder="菜单图标" />
        </el-form-item>
        <!-- 分两列展示 -->
        <el-row :gutter="20">
          <!-- 左边列 -->
          <el-col :span="12">
            <el-form-item prop="menuName" :label="menuNameLabel">
              <el-input v-model="menuFormData.menuName" placeholder="菜单名称" />
            </el-form-item>
            <el-form-item v-if="menuFormData.menuType !== 3" prop="routePath" label="路由地址">
              <el-input v-model="menuFormData.routePath" placeholder="路由地址" />
            </el-form-item>
            <el-form-item v-if="menuFormData.menuType !== 1" prop="menuPerm" label="权限标识">
              <el-input v-model="menuFormData.menuPerm" placeholder="权限标识" />
            </el-form-item>
            <el-form-item v-if="menuFormData.menuType === 3" prop="buttonStyle" label="按钮类型">
              <el-input v-model="menuFormData.buttonStyle" placeholder="按钮类型" />
            </el-form-item>
          </el-col>
          <!-- 右边列 -->
          <el-col :span="12">
            <el-form-item v-if="menuFormData.menuType === 3" prop="buttonEvent" label="按钮事件">
              <el-input v-model="menuFormData.buttonEvent" placeholder="按钮事件" />
            </el-form-item>
            <el-form-item prop="routeName" label="路由名称" v-if="menuFormData.menuType != 3">
              <el-input v-model="menuFormData.routeName" placeholder="路由名称" />
            </el-form-item>
            <el-form-item prop="componentPath" label="组件路径" v-if="menuFormData.menuType == 2">
              <el-input v-model="menuFormData.componentPath" placeholder="组件路径" />
            </el-form-item>
            <el-form-item prop="menuSort" label="菜单排序">
              <el-input-number style="width: 100%" v-model="menuFormData.menuSort" controls-position="right" />
            </el-form-item>
            <el-form-item v-if="menuFormData.menuType === 3" prop="visible" label="是否显示">
              <el-radio-group v-model="menuFormData.visible">
                <el-radio :value="1">显示</el-radio>
                <el-radio :value="2">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
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
  width: 580px;
}

.dialog-body {
  padding: 20px 10px;
}

:deep(.el-form-item__label) {
  font-weight: bold;
}

:deep(.el-select) {
  font-weight: bold;
}

:deep(.menu-type) {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.menu-label-notice {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
</style>

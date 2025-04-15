<!-- 子菜单 -->
<script setup lang="ts">
import type { PropType } from 'vue'
import SubMenu from '@/components/layout/menu/SubMenu.vue'
import type { MenuTreeVO } from '@/types/auth'

const props = defineProps({
  parentPath: { type: String, require: true },
  menuData: { type: Array as PropType<MenuTreeVO[]>, require: true }
})

const getRoutePath = (menuPath: string) => {
  if (menuPath.startsWith('/')) {
    menuPath = menuPath.substring(1)
  }
  // 完整路径 = 父路径 + 当前路径
  const fullPath = props.parentPath ? `${props.parentPath}/${menuPath}` : `/${menuPath}`
  return fullPath
}
</script>
<template>
  <template v-for="menuItem in menuData" :key="menuItem.menuId">
    <!-- 有子级菜单的时候  el-sub-menu-->
    <el-sub-menu :index="getRoutePath(menuItem.routePath)" v-if="menuItem.children && menuItem.children.length > 0">
      <template #title>
        <el-icon>
          <EZSvgIcon :icon="menuItem.menuIcon"></EZSvgIcon>
        </el-icon>
        <span>{{ menuItem.menuName }}</span>
      </template>
      <!-- 递归子菜单 -->
      <SubMenu :parentPath="menuItem.routePath" :menuData="menuItem.children" />
    </el-sub-menu>
    <!-- 没有子级菜单的时候  el-menu-item -->
    <el-menu-item v-else :index="getRoutePath(menuItem.routePath)">
      <el-icon>
        <EZSvgIcon :icon="menuItem.menuIcon"></EZSvgIcon>
      </el-icon>
      <span>{{ menuItem.menuName }}</span>
    </el-menu-item>
  </template>
</template>
<style scoped lang="scss"></style>

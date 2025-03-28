<!-- 子菜单 -->
<script setup lang="ts">
import type { MenuTreeVO } from '@/types/auth';
import type { PropType } from 'vue';
import SubMenu from '@/components/layout/menu/SubMenu.vue';

defineProps({
  menuData: { type: Array as PropType<MenuTreeVO[]>, require: true },
})
</script>
<template>
  <template v-for="menuItem in menuData" :key="menuItem.menuId">
    <!-- 有子级菜单的时候  el-sub-menu-->
    <el-sub-menu :index="menuItem.menuPath" v-if="menuItem.children && menuItem.children.length > 0">
      <template #title>
        <el-icon>
          <component :is="menuItem.menuIcon"></component>
        </el-icon>
        <span>{{ menuItem.menuName }}</span>
      </template>
      <!-- 递归子菜单 -->
      <SubMenu :menuData="menuItem.children" />
    </el-sub-menu>
    <!-- 没有子级菜单的时候  el-menu-item -->
    <el-menu-item v-else :index="menuItem.menuPath">
      <el-icon>
        <component :is="menuItem.menuIcon"></component>
      </el-icon>
      <span>{{ menuItem.menuName }}</span>
    </el-menu-item>
  </template>
</template>
<style scoped lang="scss"></style>

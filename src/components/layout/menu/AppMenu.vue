<script setup lang="ts">
import router from '@/router'
import { ref } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import SubMenu from './SubMenu.vue'
import type { MenuTreeVO } from '@/types/auth'
import { useSettingStore } from '@/stores/modules/settingStore'
import { useUserStore } from '@/stores/modules/userStore'

/***************************** 数据源 ******************************************/

const settingStore = useSettingStore()
const userStore = useUserStore()

console.log(userStore.userInfo.menus)

// 菜单数据
const menus = ref<MenuTreeVO[]>(userStore.userInfo.menus)
const route = useRoute()
// 默认选中
const defaultActive = ref(route.path)

/***************************** 方法区 ******************************************/

// 监听路由变化
onBeforeRouteUpdate((to) => {
  defaultActive.value = to.path
})
const handleSelect = (e: string) => {
  console.log(e)

  router.push(e)
}
</script>
<template>
  <el-menu
    :default-active="defaultActive"
    @select="handleSelect"
    :unique-opened="true"
    class="side-menu"
    :collapse="settingStore.isCollapse"
  >
    <el-menu-item index="/dashboard/workbench">
      <el-icon>
        <EZSvgIcon icon="ep:home-filled"></EZSvgIcon>
      </el-icon>
      <span> 工作台 </span>
    </el-menu-item>
    <SubMenu parentPath="" :menu-data="menus" />
  </el-menu>
</template>
<style lang="scss" scoped>
.el-menu {
  border: 0;
}

// 展开的宽度
.el-menu:not(.el-menu--collapse) {
  width: 100%;
}

// 折叠后宽度
.el-menu--collapse {
  width: 100%;
}
</style>

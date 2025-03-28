<script setup lang="ts">
import { MenuWidth } from '@/enums/appEnums'
import router from '@/router'
import { useUserStore } from '@/stores/modules/userStore'
import { ref } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import SubMenu from './SubMenu.vue'


/***************************** 数据源 ******************************************/

const userInfoStore = useUserStore()
const menus = userInfoStore.userInfo.menus
const route = useRoute()
// 默认选中
const defaultActive = ref(route.path)

const menuOpenWidth = MenuWidth.OPEN
const menuCloseWidth = MenuWidth.CLOSE
/***************************** 方法区 ******************************************/

// 监听路由变化
onBeforeRouteUpdate((to) => {
  defaultActive.value = to.path
})
const handleSelect = (e: string) => {
  router.push(e)
}
</script>
<template>
  <el-menu :default-active="defaultActive" @select="handleSelect" :unique-opened="true" class="side-menu"
    :collapse="userInfoStore.collapse">
    <el-menu-item index="/home">
      <el-icon>
        <HomeFilled />
      </el-icon>
      <span> 首页 </span>
    </el-menu-item>
    <SubMenu :menu-data="menus" />
  </el-menu>
</template>
<style lang="scss">
.menu-left {

  // 展开的宽度
  .el-menu:not(.el-menu--collapse) {
    width: v-bind(menuOpenWidth);
  }

  // 折叠后宽度
  .el-menu--collapse {
    width: v-bind(menuCloseWidth);
  }
}
</style>

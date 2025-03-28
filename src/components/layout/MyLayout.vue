<script lang="ts" setup>
import AppLogo from './logo/AppLogo.vue';
import AppMenu from './menu/AppMenu.vue';
import { MenuWidth } from '@/enums/appEnums'
import AppTopBar from './topbar/AppTopBar.vue';



const menuOpenWidth = MenuWidth.OPEN
const menuCloseWidth = MenuWidth.CLOSE
</script>

<template>
  <el-container class="layout">
    <!-- 左侧菜单 -->
    <el-aside class="app-sider-bar" :width="menuOpenWidth" :collapsed-width="menuCloseWidth">
      <AppLogo></AppLogo>
      <AppMenu></AppMenu>
    </el-aside>
    <!-- 右侧内容展示区域 -->
    <el-container>
      <!-- 头部 -->
      <el-header class="app-header">
        <AppTopBar></AppTopBar>
      </el-header>
      <!-- 主体 -->
      <el-main class="app-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout {
  height: 100vh;
}

.app-sider-bar {
  height: 100%;
  background-color: white;
}

.app-header {
  height: 60px + 44px;
}

.app-main {
  margin: 15px 15px;
  background-color: white;
  border: 1px solid #ebeef5;
  border-radius: 10px;
}
</style>

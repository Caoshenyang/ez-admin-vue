<script lang="ts" setup>
import { useSettingStore } from '@/stores/modules/settingStore';
import AppLogo from './logo/AppLogo.vue';
import AppMenu from './menu/AppMenu.vue';
import AppTopBar from './topbar/AppTopBar.vue';

const settingStore = useSettingStore();

</script>

<template>
  <el-container class="layout">
    <!-- 左侧菜单 -->
    <el-aside class="app-sider-bar" :width="settingStore.menuWidth">
      <AppLogo></AppLogo>
      <AppMenu></AppMenu>
    </el-aside>
    <!-- 右侧内容展示区域 -->
    <el-container>
      <!-- 头部 -->
      <el-header class="app-header">
        <AppTopBar></AppTopBar>
        <AppWorkTab></AppWorkTab>
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
  transition: width 0.3s;
  overflow-x: hidden;
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

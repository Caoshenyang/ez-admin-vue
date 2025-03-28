<script lang="ts" setup>
import AppLogo from './logo/AppLogo.vue';
import AppMenu from './menu/AppMenu.vue';

</script>

<template>
  <div class="layout">
    <el-container>
      <!-- 左侧菜单 -->
      <el-aside class="app-sider-bar">
        <AppLogo></AppLogo>
        <AppMenu></AppMenu>
      </el-aside>
      <!-- 右侧内容展示区域 -->
      <el-container>
        <!-- 头部 -->
        <el-header class="app-header">
          头部
        </el-header>
        <!-- 主体 -->
        <el-main class="app-main">
          主体
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped></style>

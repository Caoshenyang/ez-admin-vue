<script setup lang="ts">
import router from '@/router'
</script>
<template>
  <div class="h-screen flex flex-col justify-center items-center">
    <SvgIcon name="404" :size="400"></SvgIcon>
    <el-button type="primary" @click="router.push('/')">回到首页</el-button>
  </div>
</template>
<style scoped lang="scss"></style>

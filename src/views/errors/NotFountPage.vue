<script setup lang="ts">
import router from '@/router'
</script>
<template>
  <div class="not-found">
    <el-button type="primary" @click="router.push('/')">回到首页</el-button>
  </div>
</template>
<style scoped lang="scss">
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>

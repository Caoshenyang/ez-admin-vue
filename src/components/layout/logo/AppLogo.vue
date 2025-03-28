<!-- logo 组件 -->
<script setup lang="ts">
import { useSettingStore } from '@/stores/modules/settingStore';

const settingStore = useSettingStore();

</script>
<template>
  <div class="app-logo">
    <el-icon :size="36" color="#0473fb">
      <element-plus />
    </el-icon>
    <span v-if="settingStore.isCollapse" class="title">EZ-ADMIN</span>
  </div>
</template>
<style scoped lang="scss">
.app-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  cursor: pointer;
  border-right-width: 0;

}

.title {
  font-weight: 500;
  font-size: 18px;
  color: rgb(75, 85, 99);
  white-space: nowrap;
}
</style>

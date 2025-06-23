<script lang="ts" setup>
const selectedIcon = ref<string | null>(null)
</script>
<template>
  <div>
    asdas
    <SvgIcon name="games" size="24" />
    <SvgIconPicker v-model="selectedIcon" placeholder="请选择操作图标" trigger-color="#7950f2" trigger-size="28" />
    <!-- <RouterView /> -->
  </div>
</template>

<style lang="scss" scoped></style>

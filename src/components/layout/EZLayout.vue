<script lang="ts" setup>
const selectedIcon = ref<string | null>(null)
console.log(selectedIcon.value)
</script>
<template>
  <div>
    asdas
    <SvgIcon name="games" size="24" />
    <div style="width: 50%">
      <SvgIconPicker
        v-model="selectedIcon"
        placeholder="请选择应用图标"
        trigger-color="#FF6B6B"
        :trigger-size="28"
        icon-dir="/src/assets/icons"
      />
    </div>

    <!-- <RouterView /> -->
  </div>
</template>

<style lang="scss" scoped></style>

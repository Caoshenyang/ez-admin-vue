<script lang="ts" setup>
// 定义图标类型
interface Icon {
  name: string
  src: string
}
const icons = ref<Icon[]>([])
const selectedIcon = ref<string | null>(null)
// 动态导入图标
const loadIcons = async () => {
  const iconFiles = import.meta.glob('@/assets/icons/system/*.svg') as Record<
    string,
    () => Promise<{ default: string }>
  >

  for (const path in iconFiles) {
    const name = path.split('/').pop()?.replace('.svg', '') || ''
    const icon = await iconFiles[path]()
    icons.value.push({ name, src: icon.default })
  }
}

// 选中图标时更新 selectedIcon
const selectIcon = (name: string) => {
  selectedIcon.value = name
}

// 在组件挂载后加载图标
onMounted(() => {
  loadIcons()
})
</script>
<template>
  <div>
    <div class="icon-selector">
      <!-- 循环渲染所有图标 -->
      <div v-for="(icon, index) in icons" :key="index" class="icon-item" @click="selectIcon(icon.name)">
        <!-- 图标展示 -->
        <img :src="icon.src" :alt="icon.name" class="icon-image" />
        <span>{{ icon.name }}</span>
      </div>
    </div>

    <!-- 显示选中的图标名称 -->
    <div v-if="selectedIcon" class="selected-icon">
      <p>选中的图标是: {{ selectedIcon }}</p>
    </div>
  </div>
</template>
<style scoped lang="scss">
.icon-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 50px;
}

.icon-image {
  width: 40px;
  height: 40px;
}

.selected-icon {
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
}
</style>

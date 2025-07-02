<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'

const props = defineProps<{
  permission: string // 权限标识
}>()

const userStore = useUserStore()
const hasPermission = userStore.hasPermission(props.permission)
</script>

<template>
  <!-- 有权限时渲染 -->
  <template v-if="hasPermission">
    <slot />
  </template>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/userStore'
import type { PermissionType } from '@/types/auth'
import { computed } from 'vue'

const props = defineProps<{
  value: PermissionType
}>()

const userStore = useUserStore()

const hasPermission = computed(() => {
  const permissions = Array.isArray(props.value) ? props.value : [props.value]
  return permissions.some((permission) => userStore.userInfo.permissions.includes(permission))
})
</script>

<template>
  <slot v-if="hasPermission" />
</template>

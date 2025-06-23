<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  color: { type: String, default: 'currentColor' },
  size: { type: [String, Number], default: 16 },
  className: { type: String, default: '' },
})

const symbolId = computed(() => `#icon-${props.name}`)
const style = computed(() => {
  return {
    color: props.color,
    width: typeof props.size === 'number' ? `${props.size}px` : props.size,
    height: typeof props.size === 'number' ? `${props.size}px` : props.size,
  }
})
</script>

<template>
  <svg :class="className" :style="style" aria-hidden="true">
    <use :xlink:href="symbolId" />
  </svg>
</template>

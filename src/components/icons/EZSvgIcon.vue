<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({

  prefix: { type: String, default: 'icon' },
  name: { type: String, required: true },
  color: { type: String, default: '#333' },
  size: { type: Number, default: 16 }
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
<template>
  <svg aria-hidden="true" class="svg-icon" :width="size" :height="size">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>


<style lang="scss" scoped>
.svg-icon {
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;

}
</style>

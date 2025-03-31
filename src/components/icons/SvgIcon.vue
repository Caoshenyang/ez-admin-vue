<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon'
  },
  name: {
    type: String,
    required: true
  },
  className: {
    type: String,
    default: ''
  }
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
<template>
  <svg aria-hidden="true" class="svg-icon" :class="className">
    <use :xlink:href="symbolId" />
  </svg>
</template>


<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>

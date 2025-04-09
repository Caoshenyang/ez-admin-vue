<script lang="ts" setup>
import { Icon } from '@iconify/vue'

defineProps({
  icon: {
    type: String,
    required: true
  }
})
</script>
<template>
  <Icon class="ez-svg-icon" :icon="icon" v-bind="$attrs" />
</template>

<style lang="scss" scoped>
.ez-svg-icon {
  display: inline-block;
  vertical-align: middle;
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>

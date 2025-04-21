<template>
  <div class="smart-action-bar">
    <!-- 搜索区域 -->
    <Transition name="smart-slide">
      <div
        v-show="internalState.showSearch"
        class="search-area"
        :style="{
          '--columns': Math.min(effectiveConfig.length, 3),
          '--item-span': 2
        }"
      >
        <div class="form-grid">
          <template v-if="hasFormConfig">
            <component
              v-for="item in effectiveConfig"
              :key="item.field"
              :is="item.component"
              v-model="searchData[item.field]"
              v-bind="getItemProps(item)"
              :loading="isSelectComponent(item.component) ? searchData[`${item.field}Loading`] : undefined"
              :filter-method="item.props?.remoteMethod"
            >
              <template v-if="isSelectComponent(item.component)">
                <el-option
                  v-for="opt in item.props?.options || []"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </template>
            </component>
          </template>

          <slot v-else name="search-form" />
        </div>

        <div class="action-row">
          <el-button type="primary" @click="handleSearch" :loading="searchLoading">
            <template #icon><Search /></template>
            查询
          </el-button>
          <el-button @click="handleReset">重置</el-button>

          <el-link
            v-if="hasAdvancedOptions"
            type="primary"
            :icon="internalState.showAdvanced ? ArrowUp : ArrowDown"
            @click="toggleAdvanced"
            class="advanced-toggle"
          >
            {{ internalState.showAdvanced ? '简化条件' : '高级搜索' }}
          </el-link>
        </div>
      </div>
    </Transition>

    <!-- 操作栏 -->
    <div class="action-bar">
      <div class="left-group">
        <slot name="prepend-actions" />

        <el-button
          v-if="showToggleButton"
          :icon="internalState.showSearch ? ArrowUp : ArrowDown"
          @click="toggleSearch"
          class="toggle-search-btn"
        >
          {{ internalState.showSearch ? '隐藏搜索' : '显示搜索' }}
        </el-button>
      </div>

      <div class="right-group">
        <el-space :size="8" v-if="hasActions">
          <el-tooltip
            v-for="action in primaryActions"
            :key="action.name"
            :content="action.tooltip || action.label"
            placement="top"
          >
            <el-button
              :type="action.type || 'default'"
              :icon="action.icon"
              @click="emitAction(action.name)"
              :disabled="isActionDisabled(action)"
              :loading="actionLoading[action.name]"
            >
              {{ isMobile ? null : action.label }}
            </el-button>
          </el-tooltip>

          <el-dropdown v-if="secondaryActions.length > 0" trigger="click" class="more-actions-dropdown">
            <el-button type="primary" plain>
              更多<el-icon class="el-icon--right"><MoreFilled /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="action in secondaryActions"
                  :key="action.name"
                  @click="emitAction(action.name)"
                  :divided="action.divided"
                  :disabled="isActionDisabled(action)"
                >
                  <el-icon v-if="action.icon">
                    <component :is="action.icon" />
                  </el-icon>
                  {{ action.label || action.tooltip }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-space>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect, useSlots } from 'vue'
import { useWindowSize, useLocalStorage } from '@vueuse/core'
import { debounce } from 'lodash-es'
import { Search, ArrowUp, ArrowDown, MoreFilled, Refresh, Setting } from '@element-plus/icons-vue'
import type { Component } from 'vue'
import type { ActionItem, FormItem, SmartActionBarProps, SmartActionBarState } from '@/types/common'

// 默认props
const props = withDefaults(defineProps<SmartActionBarProps>(), {
  modelValue: () => ({ showSearch: true, showAdvanced: false }),
  searchParams: () => ({}),
  formConfig: () => [],
  actions: () => [
    { name: 'refresh', icon: Refresh, tooltip: '刷新' },
    { name: 'settings', icon: Setting, tooltip: '列设置' }
  ],
  maxPrimaryActions: 3,
  showToggleButton: true,
  rememberState: true,
  searchDebounce: 300
})

const emit = defineEmits<{
  'update:modelValue': [value: SmartActionBarState]
  'update:searchParams': [value: Record<string, unknown>]
  search: [params: Record<string, unknown>]
  reset: []
  action: [name: string]
}>()

// 响应式状态
const { width } = useWindowSize()
const slots = useSlots()
const searchLoading = ref(false)
const actionLoading = ref<Record<string, boolean>>({})
const searchData = ref<Record<string, unknown>>({ ...props.searchParams })

// 合并props和本地存储的状态
const internalState = useLocalStorage<SmartActionBarState>('smart-action-bar/state', () => ({ ...props.modelValue }), {
  listenToStorageChanges: props.rememberState
})

// 计算属性
const isMobile = computed(() => width.value < 768)
const hasFormConfig = computed(() => props.formConfig.length > 0 && !slots['search-form'])
const hasAdvancedOptions = computed(() => props.formConfig.some((item) => item.advanced))

const effectiveConfig = computed(() =>
  props.formConfig.filter((item) => {
    if (typeof item.hidden === 'function') return !item.hidden()
    if (item.hidden !== undefined) return !item.hidden
    return internalState.value.showAdvanced || !item.advanced
  })
)

const processedActions = computed(() =>
  props.actions
    .map((action) => ({
      ...action,
      visible: typeof action.visible === 'function' ? action.visible() : action.visible !== false,
      disabled: typeof action.disabled === 'function' ? action.disabled() : action.disabled
    }))
    .filter((action) => action.visible)
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
)

const computedActions = computed(() => [
  processedActions.value.slice(0, props.maxPrimaryActions),
  processedActions.value.slice(props.maxPrimaryActions)
])

// 使用 .value 来访问 computed 的结果，然后进行解构
const [primaryActions, secondaryActions] = computedActions.value

const hasActions = computed(() => processedActions.value.length > 0)

const isSelectComponent = (comp: string | Component) => {
  const name = typeof comp === 'string' ? comp : comp.name
  return name?.endsWith('Select')
}

const getItemProps = (item: FormItem) => ({
  clearable: true,
  placeholder: `请${item.component.name?.endsWith('Select') ? '选择' : '输入'}${item.label}`,
  style: { width: '100%' },
  ...item.props,
  ...(isSelectComponent(item.component) && { options: item.props?.options || [] })
})

const isActionDisabled = (action: ActionItem) => !!action.disabled

const debouncedSearch = debounce(() => {
  emit('update:searchParams', { ...searchData.value })
  emit('search', { ...searchData.value })
  searchLoading.value = false
}, props.searchDebounce)

const handleSearch = () => {
  searchLoading.value = true
  debouncedSearch()
}

const handleReset = () => {
  searchData.value = { ...props.searchParams }
  emit('update:searchParams', {})
  emit('reset')
  handleSearch()
}

const toggleSearch = () => {
  internalState.value.showSearch = !internalState.value.showSearch
}

const toggleAdvanced = () => {
  internalState.value.showAdvanced = !internalState.value.showAdvanced
}

const emitAction = (name: string) => {
  actionLoading.value[name] = true
  emit('action', name)
  setTimeout(() => {
    actionLoading.value[name] = false
  }, 1000)
}

// 监听props.searchParams变化
watchEffect(() => {
  searchData.value = { ...props.searchParams }
})
</script>

<style scoped lang="scss">
.smart-action-bar {
  --form-gap: 16px;
  --action-bar-height: 56px;
  --border-radius: 4px;

  &.is-mobile {
    --form-gap: 12px;
  }
}

.search-area {
  background: var(--el-fill-color-light);
  border-radius: var(--border-radius);
  margin-bottom: var(--el-margin);
  padding: var(--el-padding);
  border: 1px solid var(--el-border-color);
  box-shadow: var(--el-box-shadow-light);

  .form-grid {
    display: grid;
    gap: var(--form-gap);
    grid-template-columns: repeat(var(--columns), 1fr);
    margin-bottom: var(--form-gap);
  }

  .action-row {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    padding-top: 8px;
    border-top: 1px dashed var(--el-border-color);

    .advanced-toggle {
      margin-left: auto;
    }
  }
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--action-bar-height);

  .left-group,
  .right-group {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .search-area {
    padding: 12px;

    .form-grid {
      grid-template-columns: 1fr !important;
    }

    .action-row {
      flex-wrap: wrap;

      > * {
        flex: 1;
        min-width: 45%;
      }
    }
  }

  .action-bar {
    flex-direction: column;
    height: auto;
    gap: 12px;

    .left-group,
    .right-group {
      width: 100%;
      justify-content: space-between;
    }
  }
}

/* 过渡动画 */
.smart-slide-enter-active,
.smart-slide-leave-active {
  transition: all 0.3s var(--el-transition-function-ease-in-out-bezier);
  overflow: hidden;
}

.smart-slide-enter-from,
.smart-slide-leave-to {
  max-height: 0;
  opacity: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
  border-width: 0;
}

.smart-slide-enter-to,
.smart-slide-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>

<template>
  <!-- 根容器添加移动端类名 -->
  <div class="smart-action-bar">
    <!-- 动态搜索区域 - 使用自定义过渡动画 -->
    <Transition name="smart-slide">
      <div
        v-show="internalState.showSearch"
        class="search-area"
        :style="{
          '--columns': Math.min(effectiveConfig.length, 3),
          '--item-span': 2
        }"
      >
        <!-- 自动表单生成区域 -->
        <div class="form-grid">
          <template v-if="hasFormConfig">
            <!-- 动态渲染每个表单项 -->
            <component
              v-for="item in effectiveConfig"
              :is="resolveComponent(item.component)"
              :key="item.field"
              v-model="searchData[item.field]"
              v-bind="getItemProps(item)"
              :label="item.label"
              class="form-item"
              :style="{ 'grid-column': `span ${item.span || 1}` }"
            />
          </template>

          <!-- 自定义表单插槽（优先级高于自动配置） -->
          <slot v-else name="search-form" />
        </div>

        <!-- 搜索操作按钮组 -->
        <div class="action-row">
          <el-button type="primary" @click="handleSearch" :loading="searchLoading">
            <template #icon><Search /></template>
            查询
          </el-button>
          <el-button @click="handleReset">重置</el-button>

          <!-- 高级搜索切换按钮（仅当有高级选项时显示） -->
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

    <!-- 主操作工具栏 -->
    <div class="action-bar">
      <!-- 左侧操作按钮区 -->
      <div class="left-group">
        <!-- 前置操作插槽 -->
        <slot name="prepend-actions" />

        <!-- 搜索栏切换按钮 -->
        <el-button
          v-if="showToggleButton"
          :icon="internalState.showSearch ? ArrowUp : ArrowDown"
          @click="toggleSearch"
          class="toggle-search-btn"
        >
          {{ internalState.showSearch ? '隐藏搜索' : '显示搜索' }}
        </el-button>
      </div>

      <!-- 右侧操作按钮区 -->
      <div class="right-group">
        <el-space :size="8" v-if="hasActions">
          <!-- 主要操作按钮（带Tooltip提示） -->
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

          <!-- 更多操作下拉菜单 -->
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
import { computed, ref, watchEffect, useSlots, type Component } from 'vue'
import { useWindowSize, useLocalStorage } from '@vueuse/core'
import { debounce } from 'lodash-es'
import { Search, ArrowUp, ArrowDown, MoreFilled, Refresh, Setting } from '@element-plus/icons-vue'
import { hasPermission } from '@/utils/permission'
import type { ActionItem, FormItem, SmartActionBarProps, SmartActionBarState } from '@/types/common'

// =============== 组件逻辑 =============== //
const props = withDefaults(defineProps<SmartActionBarProps>(), {
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

// =============== 响应式状态 =============== //
const { width } = useWindowSize()
const slots = useSlots()
const searchLoading = ref(false)
const actionLoading = ref<Record<string, boolean>>({})

// 合并props和本地存储的状态
const internalState = useLocalStorage('smart-action-bar/state', () => ({ ...props.modelValue }), {
  listenToStorageChanges: true
})

// 搜索表单数据（深度响应式）
const searchData = ref(JSON.parse(JSON.stringify(props.searchParams)))

// =============== 计算属性 =============== //
const isMobile = computed(() => width.value < 768)

// 是否有表单配置
const hasFormConfig = computed(() => props.formConfig.length > 0 && !slots['search-form'])

// 是否有高级选项
const hasAdvancedOptions = computed(() => props.formConfig.some((item) => item.advanced))

// 有效的表单配置（根据高级选项过滤）
const effectiveConfig = computed(() =>
  props.formConfig.filter((item) => {
    if (typeof item.hidden === 'function') return !item.hidden()
    if (item.hidden !== undefined) return !item.hidden
    return internalState.value.showAdvanced || !item.advanced
  })
)

// 处理后的操作按钮
const processedActions = computed(() =>
  props.actions
    .map((action) => ({
      ...action,
      // 处理可见性
      visible: typeof action.visible === 'function' ? action.visible() : action.visible !== false,
      // 处理权限（假设有权限检查函数）
      disabled: typeof action.disabled === 'function' ? action.disabled() : action.disabled
    }))
    .filter((action) => action.visible)
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
)

// 主要操作按钮
const primaryActions = computed(() => processedActions.value.slice(0, props.maxPrimaryActions))

// 次要操作按钮（更多菜单中的）
const secondaryActions = computed(() => processedActions.value.slice(props.maxPrimaryActions))

// 是否有操作按钮
const hasActions = computed(() => processedActions.value.length > 0)

// =============== 方法 =============== //
/**
 * 解析组件名称（自动添加El前缀）
 * @param comp 组件名或组件对象
 */
const resolveComponent = (comp: string | Component): string | Component => {
  return typeof comp === 'string' ? (comp.startsWith('El') ? comp : `El${comp}`) : comp
}

/**
 * 获取表单项的props（合并默认props）
 * @param item 表单项配置
 */
const getItemProps = (item: FormItem) => {
  const defaults = {
    clearable: true,
    placeholder: `请输入${item.label}`,
    style: { width: '100%' }
  }
  return { ...defaults, ...item.props }
}

/**
 * 检查操作是否禁用
 * @param action 操作项
 */
const isActionDisabled = (action: ActionItem) => {
  return !!(action.disabled || (action.permission && !hasPermission(action.permission)))
}

// 防抖搜索方法
const debouncedSearch = debounce(() => {
  emit('update:searchParams', { ...searchData.value })
  emit('search', { ...searchData.value })
  searchLoading.value = false
}, props.searchDebounce)

/**
 * 触发搜索
 */
const handleSearch = () => {
  searchLoading.value = true
  debouncedSearch()
}

/**
 * 重置搜索
 */
const handleReset = () => {
  searchData.value = JSON.parse(JSON.stringify(props.searchParams))
  emit('update:searchParams', {})
  emit('reset')
  // 重置后立即触发搜索
  handleSearch()
}

/**
 * 切换搜索区域显示
 */
const toggleSearch = () => {
  internalState.value.showSearch = !internalState.value.showSearch
}

/**
 * 切换高级搜索
 */
const toggleAdvanced = () => {
  internalState.value.showAdvanced = !internalState.value.showAdvanced
}

/**
 * 触发操作事件
 * @param name 操作名称
 */
const emitAction = (name: string) => {
  actionLoading.value[name] = true
  emit('action', name)
  setTimeout(() => {
    actionLoading.value[name] = false
  }, 1000)
}

// =============== 生命周期 =============== //
// 监听props.searchParams变化
watchEffect(() => {
  searchData.value = JSON.parse(JSON.stringify(props.searchParams))
})

// 组件卸载时取消防抖
onUnmounted(() => {
  debouncedSearch.cancel()
})
</script>

<style scoped lang="scss">
/* 根容器样式 */
.smart-action-bar {
  --form-gap: 16px;
  --action-bar-height: 56px;
  --border-radius: 4px;

  &.is-mobile {
    --form-gap: 12px;
  }
}

/* 搜索区域样式 */
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

    .form-item {
      &:deep(.el-form-item__label) {
        font-weight: 500;
      }
    }
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

/* 操作栏样式 */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--action-bar-height);

  .left-group {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .right-group {
    display: flex;
    gap: 4px;
    align-items: center;

    .more-actions-dropdown {
      margin-left: 4px;
    }
  }
}

/* 移动端适配 */
.is-mobile {
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

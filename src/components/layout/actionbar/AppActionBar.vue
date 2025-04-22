<script setup lang="ts">
import { computed, ref, watchEffect, useSlots } from 'vue'
import { debounce } from 'lodash-es'
import { Search, ArrowUp, ArrowDown, MoreFilled, Refresh, Setting, RefreshRight } from '@element-plus/icons-vue'
import type { Component } from 'vue'
import type { ActionItem, FormItem, SmartActionBarProps } from '@/types/common'
import { hasPermission } from '@/utils/permission'

// 默认props
const props = withDefaults(defineProps<SmartActionBarProps>(), {
  searchParams: () => ({}),
  formConfig: () => [],
  actions: () => [],
  maxPrimaryActions: 3, // 最多显示几个主按钮
  showToggleButton: true, // 是否显示折叠按钮
  showRefreshButton: true, // 是否显示刷新按钮
  showSettingButton: true, // 是否显示列设置按钮
  rememberState: true, // 是否记住状态
  searchDebounce: 300 // 搜索防抖时间
})

// 控制全局折叠状态
const globalCollapsed = ref(true)

// 事件
const emit = defineEmits<{
  'update:searchParams': [value: Record<string, unknown>] // 更新搜索参数
  search: [params: Record<string, unknown>] // 搜索
  reset: [] // 重置
  action: [name: string] // 操作
}>()

// 响应式状态
const searchLoading = ref(false)
const actionLoading = ref<Record<string, boolean>>({})
const searchData = ref<Record<string, unknown>>({ ...props.searchParams })

// 是否有折叠的筛选条件
const hasCollapsedOptions = computed(() => props.formConfig.some((item) => item.collapsed))
// 是否设置了表单配置，且没有插槽，则显示搜索表单（插槽优先，不同时生效）
const hasFormConfig = computed(() => props.formConfig.length > 0)

// 筛选出所有需要显示的筛选条件
const effectiveConfig = computed(() =>
  props.formConfig.filter((item) => {
    if (typeof item.hidden === 'function') return !item.hidden()
    return item.hidden !== true
  })
)

// 搜索表单操作项（按顺序返回 visible - 需要显示的）
const processedActions = computed(() => {
  return props.actions
    .map((action) => {
      const visible = typeof action.visible === 'function' ? action.visible() : action.visible !== false
      const disabled = typeof action.disabled === 'function' ? action.disabled() : action.disabled
      return { ...action, visible, disabled }
    })
    .filter((action) => action.visible) // 只保留 visible 为 true 的 action
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) // 使用 nullish coalescing 运算符来简化默认值处理
})

// 根据 maxPrimaryActions 分割 primaryActions 和 secondaryActions 展示的按钮和更多按钮
const computedActions = computed(() => [
  processedActions.value.slice(0, props.maxPrimaryActions),
  processedActions.value.slice(props.maxPrimaryActions)
])

// 使用 .value 来访问 computed 的结果，然后进行解构
const [primaryActions, secondaryActions] = computedActions.value

// 计算是否有操作按钮
const hasActions = computed(() => processedActions.value.length > 0)

// 是否为选择组件
const isSelectComponent = (comp: string | Component) => {
  const name = typeof comp === 'string' ? comp : comp.name
  return name?.endsWith('Select')
}

// 获取表单项的属性
const getItemProps = (item: FormItem) => ({
  clearable: true,
  placeholder: `请${item.component.name?.endsWith('Select') ? '选择' : '输入'}${item.label}`,
  style: { width: '100%' },
  ...item.props,
  ...(isSelectComponent(item.component) && { options: item.props?.options || [] })
})

/**
 * 检查操作是否禁用
 * @param action 操作项
 */
const isActionDisabled = (action: ActionItem) => {
  return !!(action.disabled || (action.permission && !hasPermission(action.permission)))
}

// 防抖操作
const debouncedSearch = debounce(() => {
  emit('update:searchParams', { ...searchData.value }) // 发送 'update:searchParams' 事件，携带 searchData 作为参数
  emit('search', { ...searchData.value }) // 发送 'search' 事件，携带 searchData 作为参数
  searchLoading.value = false // 将搜索加载状态设置为 false，表示搜索操作完成
}, props.searchDebounce) // 这里传入了防抖的时间间隔，来自组件的 props

// 搜索触发
const handleSearch = () => {
  searchLoading.value = true
  debouncedSearch()
}

// 重置触发
const handleReset = () => {
  searchData.value = { ...props.searchParams }
  emit('update:searchParams', {})
  emit('reset')
  handleSearch()
}

// 搜索栏折叠
const toggleSearch = () => {
  internalState.value.showSearch = !internalState.value.showSearch
}

// 高级搜索栏折叠
const toggleAdvanced = () => {
  internalState.value.showAdvanced = !internalState.value.showAdvanced
}

// 操作栏事件提交
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
        <el-form class="form-grid">
          <template v-if="hasFormConfig">
            <el-form-item v-for="item in effectiveConfig" :key="item.field" :prop="item.field" :label="item.label">
              <component
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
            </el-form-item>
          </template>
        </el-form>

        <div class="action-row">
          <div>
            <el-button type="primary" :icon="Search" @click="handleSearch" :loading="searchLoading">查询</el-button>
            <el-button @click="handleReset" :icon="RefreshRight">重置</el-button>
          </div>
          <el-link
            v-if="hasAdvancedOptions"
            type="primary"
            :icon="internalState.showAdvanced ? ArrowUp : ArrowDown"
            :underline="false"
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
      <!-- 主要操作选项 -->
      <div class="left-group">
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
      <div class="right-group">
        <el-space :size="8">
          <!-- 搜索折叠按钮 -->
          <el-button v-if="showToggleButton" :icon="Search" @click="toggleSearch" />
          <!-- 列表刷新按钮 -->
          <el-button
            v-if="showRefreshButton"
            :loading="actionLoading['refresh']"
            :icon="Refresh"
            @click="emitAction('refresh')"
          />
          <!-- 表头显示隐藏设置按钮 -->
          <el-button v-if="showSettingButton" :icon="Setting" @click="emitAction('setting')" />
        </el-space>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-area {
  border-radius: 4px;
  border: 1px solid var(--el-border-color);
  box-shadow: var(--el-box-shadow-light);

  .form-grid {
    padding: 10px;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(var(--columns), 1fr);
    margin-bottom: var(--form-gap);
  }

  .action-row {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    padding: 8px 10px;
    border-top: 1px dashed var(--el-border-color);

    .advanced-toggle {
      margin-left: 30px;
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

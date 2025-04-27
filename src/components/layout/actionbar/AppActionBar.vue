<script setup lang="ts">
import { ref, computed, onMounted, defineExpose } from 'vue'
import { debounce } from 'lodash-es'
import { Search, ArrowUp, ArrowDown, MoreFilled, Refresh, Setting, Switch } from '@element-plus/icons-vue'
import { propsConfigMap, resolveComponentByField, type FormField, type SmartActionBarProps } from '.'

// 组件属性定义
const props = withDefaults(defineProps<SmartActionBarProps>(), {
  filters: () => [],
  actions: () => [],
  maxPrimaryActions: 4,
  debounceTime: 300
})

// 组件事件定义
const emit = defineEmits(['search', 'action'])

// 响应式状态
const searchEnabled = ref(true) // 是否启用搜索
const advancedVisible = ref(false) // 是否显示高级搜索
const extendedCollapsed = ref(true) // 是否折叠扩展选项
const quickSearch = ref('') // 快速搜索关键词
const advancedFilters = ref<Record<string, unknown>>({}) // 高级筛选值
const actionLoading = ref<Record<string, boolean>>({}) // 操作加载状态

// 计算属性：基础筛选字段（非隐藏、非折叠、非系统）
const basicFilterItems = computed(() => {
  return props.filters.filter((item) => !item.hidden && !item.collapsed && !item.system)
})

// 计算属性：扩展筛选字段（非隐藏、折叠、非系统）
const extendedFilterItems = computed(() => {
  return props.filters.filter((item) => !item.hidden && item.collapsed && !item.system)
})

// 计算属性：是否存在扩展筛选字段
const hasExtendedFilters = computed(() => {
  return extendedFilterItems.value.length > 0
})

// 计算属性：系统字段（不会显示在UI上）
const systemFilterItems = computed(() => {
  return props.filters.filter((item) => item.system)
})

// 计算属性：分组操作按钮（主操作和次级操作）根据设置默认显示的数量进行分割
// 计算属性：主操作按钮（默认显示的数量）
const primaryActions = computed(() => props.actions.slice(0, props.maxPrimaryActions))
// 计算属性：次级操作按钮（超出默认显示数量的部分）
const secondaryActions = computed(() => props.actions.slice(props.maxPrimaryActions))

/**
 * 获取组件的props
 * @param item 筛选字段配置
 * @returns 组件props对象
 */
const getComponentProps = (item: FormField) => {
  const config = propsConfigMap.get(item.type) || { placeholder: (label: string) => `请输入${label}`, defaultProps: {} }

  return {
    clearable: true,
    style: { width: '100%' },
    placeholder: typeof config.placeholder === 'function' ? config.placeholder(item.label) : config.placeholder,
    ...config.defaultProps,
    ...item.props
  }
}

// 切换搜索开关
const toggleSearchEnabled = () => {
  searchEnabled.value = !searchEnabled.value
}

// 切换高级搜索面板
const toggleAdvanced = () => {
  advancedVisible.value = !advancedVisible.value
}

// 切换扩展选项
const toggleExtended = () => {
  extendedCollapsed.value = !extendedCollapsed.value
}

// 处理搜索（带防抖）
const handleSearch = debounce(() => {
  const params = {
    keyword: quickSearch.value,
    ...advancedFilters.value,
    ...getSystemFilters()
  }
  emit('search', params)
}, props.debounceTime)

// 处理重置
const handleReset = () => {
  quickSearch.value = ''
  advancedFilters.value = {}
}

// 处理操作按钮点击
const handleAction = (name: string) => {
  actionLoading.value[name] = true
  emit('action', name)
  setTimeout(() => {
    actionLoading.value[name] = false
  }, 1000)
}

/**
 * 获取系统筛选参数（不会显示在UI上）
 * @returns 系统参数对象
 */
const getSystemFilters = () => {
  return systemFilterItems.value.reduce(
    (acc, item) => {
      if (advancedFilters.value[item.prop] !== undefined) {
        acc[item.prop] = advancedFilters.value[item.prop]
      }
      return acc
    },
    {} as Record<string, unknown>
  )
}

// 初始化状态
const initState = () => {
  // 初始化高级筛选字段值
  props.filters.forEach((item) => {
    if (item.prop && !advancedFilters.value[item.prop]) {
      advancedFilters.value[item.prop] = ''
    }
  })
}

// 选项数据标准化
const normalizeOptions = (options: unknown) =>
  Array.isArray(options)
    ? options.map((opt) => ({
        label: String(opt.label || ''),
        value: opt.value,
        disabled: Boolean(opt.disabled)
      }))
    : []

const getOptions = (field: FormField) =>
  'options' in field ? (typeof field.options === 'function' ? [] : normalizeOptions(field.options)) : []

// 组件挂载时初始化
onMounted(initState)

// 暴露重置表单的方法，供父组件调用
defineExpose({
  handleReset
})
</script>

<template>
  <!-- 主容器 -->
  <div class="smart-action-container">
    <!-- 搜索区域（带过渡动画） -->
    <transition name="smart-transition">
      <div v-show="searchEnabled" class="search-area">
        <!-- 快速搜索栏 -->
        <div class="quick-search-bar" v-if="!advancedVisible">
          <el-input
            v-model="quickSearch"
            placeholder="输入关键词搜索..."
            clearable
            @keyup.enter="handleSearch"
            size="large"
          >
            <template #append>
              <el-button :icon="Search" @click="handleSearch" />
            </template>
          </el-input>
        </div>
        <!-- 高级筛选区域（带过渡动画） -->
        <transition name="smart-transition">
          <div v-show="advancedVisible" class="advanced-filters">
            <el-form ref="advancedForm" :model="advancedFilters">
              <!-- 基础筛选条件 -->
              <div class="basic-filters">
                <el-row :gutter="20">
                  <!-- 遍历基础筛选字段 -->
                  <el-col v-for="item in basicFilterItems" :key="item.prop" :span="item.span || 6">
                    <el-form-item :label="item.label" :prop="item.prop">
                      <!-- 动态组件渲染 -->
                      <component
                        :is="resolveComponentByField(item)"
                        v-model="advancedFilters[item.prop]"
                        v-bind="getComponentProps(item)"
                      >
                        <template v-if="item.type === 'select'">
                          <el-option
                            v-for="opt in getOptions(item) || []"
                            :key="opt.value"
                            :label="opt.label"
                            :value="opt.value"
                          />
                        </template>
                      </component>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <!-- 筛选操作按钮 -->
                    <div class="filter-actions">
                      <el-button type="primary" @click="handleSearch"> 搜索 </el-button>
                      <el-button @click="handleReset">重置</el-button>
                      <el-button
                        link
                        type="primary"
                        @click="toggleExtended"
                        :icon="extendedCollapsed ? ArrowDown : ArrowUp"
                        v-if="hasExtendedFilters"
                      >
                        {{ extendedCollapsed ? '显示更多' : '隐藏选项' }}
                      </el-button>
                    </div>
                  </el-col>
                </el-row>
              </div>

              <!-- 扩展筛选条件 -->
              <template v-if="hasExtendedFilters">
                <!-- 扩展筛选条件（带过渡动画） -->
                <transition name="smart-transition">
                  <div v-show="!extendedCollapsed" class="extended-filters">
                    <el-row :gutter="20">
                      <!-- 遍历扩展筛选字段 -->
                      <el-col v-for="item in extendedFilterItems" :key="item.prop" :span="item.span || 6">
                        <el-form-item :label="item.label" :prop="item.prop">
                          <component
                            :is="resolveComponentByField(item)"
                            v-model="advancedFilters[item.prop]"
                            v-bind="getComponentProps(item)"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </transition>
              </template>
            </el-form>
          </div>
        </transition>
      </div>
    </transition>

    <!-- 控制栏：包含搜索开关和操作按钮 -->
    <div class="control-bar">
      <!-- 操作按钮组 -->
      <div class="action-group">
        <!-- 主操作按钮区 -->
        <el-space :size="8">
          <!-- 遍历主操作按钮 -->
          <el-tooltip :show-after="500" v-for="action in primaryActions" :key="action.name" :content="action.tooltip">
            <el-button
              :type="action.type"
              :icon="action.icon"
              :disabled="action.disabled"
              :loading="actionLoading[action.name]"
              @click="handleAction(action.name)"
            />
          </el-tooltip>

          <!-- 更多操作下拉菜单 -->
          <el-dropdown v-if="secondaryActions.length > 0">
            <el-button type="primary" plain>
              更多<el-icon class="el-icon--right"><MoreFilled /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="action in secondaryActions"
                  :key="action.name"
                  :disabled="action.disabled"
                  @click="handleAction(action.name)"
                >
                  {{ action.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-space>
      </div>
      <!-- 工具按钮组 -->
      <el-space :size="8" class="tool-buttons">
        <!-- 搜索开关按钮 -->
        <el-tooltip :show-after="1000" :content="searchEnabled ? '隐藏搜索' : '显示搜索'">
          <el-button :icon="Search" circle @click="toggleSearchEnabled" />
        </el-tooltip>
        <!-- 简易/高级 切换按钮，只有当搜索显示时显示 -->
        <el-tooltip :show-after="1000" v-if="searchEnabled" :content="advancedVisible ? '简易' : '高级'">
          <el-button :icon="Switch" circle @click="toggleAdvanced" />
        </el-tooltip>
        <el-tooltip :show-after="1000" content="刷新">
          <el-button :icon="Refresh" circle @click="handleAction('refresh')" />
        </el-tooltip>
        <el-tooltip :show-after="1000" content="列设置">
          <el-button :icon="Setting" circle @click="handleAction('settings')" />
        </el-tooltip>
      </el-space>
    </div>
  </div>
</template>

<style scoped lang="scss">
.smart-action-container {
  user-select: none;
  margin-bottom: 16px;
}

.control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .action-group {
    display: flex;
    align-items: center;
    gap: 12px;

    .tool-buttons {
      margin-left: auto;
    }
  }
}

.search-area {
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .quick-search-bar {
    width: 500px;
  }

  .advanced-filters {
    width: 100%;
    .filter-actions {
      display: flex;
      align-items: center;
    }
  }
}

/* 智能过渡动画 */
.smart-transition {
  &-enter-active,
  &-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
  }

  &-enter-from,
  &-leave-to {
    max-height: 0;
    opacity: 0;
    padding: 0;
    margin: 0;
  }

  &-enter-to,
  &-leave-from {
    max-height: 1000px;
    opacity: 1;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .control-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    .action-group {
      width: 100%;
      justify-content: space-between;
    }
  }

  .quick-search-bar {
    flex-direction: column;
  }
}
</style>

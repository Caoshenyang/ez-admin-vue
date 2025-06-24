<template>
  <div class="icon-picker">
    <!-- 触发按钮 -->
    <div class="trigger" @click="showModal = true">
      <div v-if="currentSelectedIcon" class="selected-icon">
        <SvgIcon :name="currentSelectedIcon" :size="triggerSize" :color="triggerColor" />
        <span class="icon-name">{{ getSimpleIconName(currentSelectedIcon) }}</span>
      </div>
      <div v-else class="placeholder">
        {{ placeholder }}
      </div>
      <div v-if="currentSelectedIcon" class="delete-icon" @click.stop="clearSelection">
        <SvgIcon name="delete" size="24" color="#999" />
      </div>
      <SvgIcon v-else name="chevron-down" size="16" color="#999" class="arrow-icon" />
    </div>

    <!-- 图标选择模态框 -->
    <Transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <h3>选择图标</h3>
            <div class="count">已加载图标: {{ icons.length }} 个</div>
            <button class="close-btn" @click="closeModal">
              <SvgIcon name="close" size="20" color="#999" />
            </button>
          </div>

          <div class="search-container">
            <div class="search-icon-container">
              <SvgIcon name="search" size="18" color="#999" />
            </div>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="搜索图标名称..."
              class="search-input"
              ref="searchInput"
            />
            <button class="clear-btn" v-if="searchTerm" @click="searchTerm = ''">
              <SvgIcon name="close" size="14" color="#999" />
            </button>
          </div>

          <div v-if="isLoading" class="loading">
            <SvgIcon name="loading" size="32" color="#42b883" class="spinner" />
            <span>加载图标中...</span>
          </div>

          <div v-else class="icon-container">
            <div v-if="filteredIcons.length === 0" class="no-results">
              <SvgIcon name="file-search" size="48" color="#999" />
              <p>没有找到匹配的图标</p>
              <button class="show-all-btn" @click="searchTerm = ''">查看全部图标</button>
            </div>

            <div v-else class="icon-grid">
              <div
                v-for="(icon, index) in filteredIcons"
                :key="index"
                :class="['icon-item', { selected: tempSelectedIcon === icon }]"
                @click="tempSelectIcon(icon)"
                :title="getSimpleIconName(icon)"
              >
                <div class="icon-preview">
                  <SvgIcon :name="icon" size="40" color="#495057" />
                </div>
                <div class="icon-name">{{ getSimpleIconName(icon) }}</div>
              </div>
            </div>
          </div>

          <div class="preview-footer">
            <div v-if="tempSelectedIcon" class="preview-selected">
              <div class="icon-preview-large">
                <SvgIcon :name="tempSelectedIcon" size="48" color="#495057" />
              </div>
              <div class="icon-name-large">{{ tempSelectedIcon }}</div>
            </div>
            <div v-else class="no-selection">
              <SvgIcon name="mouse-pointer" size="20" color="#999" />
              <span>请选择一个图标</span>
            </div>
            <div class="actions">
              <button class="cancel-btn" @click="closeModal">取消</button>
              <button class="confirm-btn" :disabled="!tempSelectedIcon" @click="confirmSelection">确认选择</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    placeholder?: string
    triggerColor?: string
    triggerSize?: number
  }>(),
  {
    modelValue: null,
    placeholder: '选择图标',
    triggerColor: '#42b883',
    triggerSize: 24,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'change', value: string | null): void
}>()

// 状态管理
const showModal = ref(false)
const searchTerm = ref('')
const currentSelectedIcon = ref<string | null>(props.modelValue || null)
const tempSelectedIcon = ref<string | null>(null) // 临时选择的图标
const isLoading = ref(true)
const icons = ref<string[]>([])
const searchInput = ref<HTMLInputElement | null>(null)

// 获取所有SVG图标名称
const fetchIcons = async () => {
  try {
    // 使用Vite的import.meta.glob加载所有SVG文件
    const svgModules = import.meta.glob('/src/assets/icons/*.svg', { eager: true })
    icons.value = Object.keys(svgModules)
      .map((path) => {
        const filename = path.split('/').pop() || ''
        return filename.replace('.svg', '')
      })
      .sort()

    isLoading.value = false
  } catch (error) {
    console.error('加载图标失败:', error)
    isLoading.value = false
  }
}

// 格式化图标名称（去掉前缀）
const getSimpleIconName = (fullName: string) => {
  if (!fullName) return ''
  const names = fullName.split('-')
  return names.length > 1 ? names.slice(1).join('-') : fullName
}

// 过滤后的图标列表
const filteredIcons = computed(() => {
  if (!searchTerm.value) return icons.value

  const term = searchTerm.value.toLowerCase()
  return icons.value.filter(
    (icon) => icon.toLowerCase().includes(term) || getSimpleIconName(icon).toLowerCase().includes(term),
  )
})

// 临时选择图标（未确认）
function tempSelectIcon(icon: string) {
  tempSelectedIcon.value = icon
}

// 清除选择
function clearSelection(e: Event) {
  e.stopPropagation()
  currentSelectedIcon.value = null
  tempSelectedIcon.value = null
  emit('update:modelValue', null)
  emit('change', null)
}

// 确认选择
function confirmSelection() {
  if (tempSelectedIcon.value) {
    currentSelectedIcon.value = tempSelectedIcon.value
    emit('update:modelValue', currentSelectedIcon.value)
    emit('change', currentSelectedIcon.value)
    showModal.value = false
  }
}

// 关闭模态框
function closeModal() {
  // 重置临时选择状态
  tempSelectedIcon.value = null
  searchTerm.value = ''
  showModal.value = false
}

// 当模态框显示时自动聚焦搜索框
watch(showModal, async (val) => {
  if (val) {
    if (icons.value.length === 0) {
      await fetchIcons()
    }

    // 初始化临时选择状态
    tempSelectedIcon.value = currentSelectedIcon.value

    await nextTick()
    if (searchInput.value) {
      searchInput.value.focus()
    }
  }
})

// 监听外部模型值变化
watch(
  () => props.modelValue,
  (val) => {
    currentSelectedIcon.value = val || null
  },
)

// 初始化时预加载图标
onMounted(fetchIcons)
</script>

<style scoped>
/* 样式部分保持不变，与之前相同 */
.icon-picker {
  position: relative;
  width: 100%;
  height: 100%;
  font-family: 'Inter', system-ui, sans-serif;
  --primary-color: #42b883;
  --primary-light: rgba(66, 184, 131, 0.15);
  --gray-100: #f8f9fa;
  --gray-200: #e9ecef;
  --gray-300: #dee2e6;
  --gray-500: #adb5bd;
  --gray-600: #6c757d;
  --gray-700: #495057;
  --gray-800: #343a40;
  --border-radius: 12px;
  --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  padding: 8px 16px;
  background-color: white;
  cursor: pointer;
  transition: var(--transition);
  height: 100%; /* 设置高度为100% */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.trigger:hover {
  border-color: var(--gray-500);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.selected-icon {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.icon-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-800);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.placeholder {
  color: var(--gray-500);
  font-size: 14px;
  flex: 1;
}

.delete-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 24px;
  transition: var(--transition);
  cursor: pointer;
  margin-left: 8px;
}

.delete-icon:hover {
  background-color: var(--gray-200);
  color: var(--gray-700);
}

.arrow-icon {
  margin-left: 8px;
  transition: transform 0.3s;
}

.trigger:hover .arrow-icon {
  transform: translateY(2px);
}

/* Modal transition */
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease-out;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background-color: var(--gray-100);
  border-bottom: 1px solid var(--gray-200);
}

.modal-header h3 {
  margin: 0;
  font-weight: 600;
  color: var(--gray-800);
  font-size: 1.25rem;
}

.count {
  font-size: 0.875rem;
  color: var(--gray-600);
  margin: 0 16px 0 auto;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.close-btn:hover {
  background-color: var(--gray-200);
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: white;
  border-bottom: 1px solid var(--gray-200);
}

.search-icon-container {
  position: absolute;
  left: 32px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: var(--transition);
  font-family: inherit;
  background-color: var(--gray-100);
}

.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.2);
}

.clear-btn {
  position: absolute;
  right: 32px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.clear-btn:hover {
  background-color: var(--gray-200);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: var(--gray-600);
  gap: 16px;
}

.loading span {
  margin-top: 12px;
}

.spinner {
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: var(--gray-600);
  gap: 16px;
}

.no-results p {
  margin: 8px 0;
  line-height: 1.5;
}

.show-all-btn {
  margin-top: 16px;
  padding: 8px 20px;
  background-color: var(--gray-200);
  border: none;
  border-radius: 6px;
  color: var(--gray-800);
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
}

.show-all-btn:hover {
  background-color: var(--gray-300);
}

.icon-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  scrollbar-width: thin;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
  padding: 8px 0 24px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 18px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: var(--transition);
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  border: 1px solid transparent;
}

.icon-item:hover {
  background-color: rgba(66, 184, 131, 0.06);
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  border-color: rgba(66, 184, 131, 0.1);
}

.icon-item.selected {
  background-color: rgba(66, 184, 131, 0.12);
  border: 1px solid rgba(66, 184, 131, 0.2);
  position: relative;
}

.icon-item.selected::after {
  content: '';
  position: absolute;
  top: 8px;
  right: 8px;
  width: 12px;
  height: 12px;
  background-color: var(--primary-color);
  border-radius: 50%;
}

.icon-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  border-radius: 6px;
  background-color: var(--gray-100);
  width: 48px;
  height: 48px;
}

.icon-name {
  font-size: 13px;
  text-align: center;
  color: var(--gray-700);
  font-weight: 500;
  line-height: 1.3;
  word-break: break-word;
  max-width: 100%;
  padding: 0 4px;
}

.preview-footer {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: var(--gray-100);
  border-top: 1px solid var(--gray-200);
  align-items: center;
  gap: 16px;
}

.preview-selected {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-preview-large {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.icon-name-large {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-selection {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--gray-500);
  font-size: 15px;
}

.actions {
  display: flex;
  gap: 12px;
}

.cancel-btn {
  padding: 10px 24px;
  background-color: white;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;
  color: var(--gray-700);
}

.cancel-btn:hover {
  background-color: var(--gray-100);
  border-color: var(--gray-400);
}

.confirm-btn {
  padding: 10px 24px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
  min-width: 120px;
}

.confirm-btn:hover:not(:disabled) {
  background-color: #3aa776;
}

.confirm-btn:disabled {
  background-color: var(--gray-300);
  cursor: not-allowed;
}
</style>

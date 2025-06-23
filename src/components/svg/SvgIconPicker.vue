<template>
  <div class="icon-picker">
    <!-- 触发按钮 -->
    <div class="trigger" @click="showModal = true">
      <div v-if="selectedIcon" class="selected-icon">
        <SvgIcon :name="selectedIcon" :size="triggerSize" :color="triggerColor" />
      </div>
      <div v-else class="placeholder">
        {{ placeholder }}
      </div>
      <SvgIcon name="chevron-down" size="16" color="#999" class="arrow-icon" />
    </div>

    <!-- 图标选择模态框 -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>选择图标</h3>
          <button class="close-btn" @click="showModal = false">
            <SvgIcon name="close" size="20" color="#999" />
          </button>
        </div>

        <div class="search-container">
          <div class="search-icon-container">
            <SvgIcon name="search" size="18" color="#999" />
          </div>
          <input v-model="searchTerm" type="text" placeholder="搜索图标..." class="search-input" />
          <button class="clear-btn" v-if="searchTerm" @click="searchTerm = ''">
            <SvgIcon name="close" size="14" color="#999" />
          </button>
        </div>

        <div class="filters">
          <div class="color-filters">
            <button
              v-for="(color, index) in colorFilters"
              :key="index"
              :class="['color-btn', { active: currentColor === color }]"
              :style="{ backgroundColor: color }"
              @click="currentColor = color"
            ></button>
          </div>
          <div class="size-slider">
            <label class="slider-label">预览大小</label>
            <input type="range" v-model="previewSize" min="16" max="72" class="slider" />
            <span class="size-value">{{ previewSize }}px</span>
          </div>
        </div>

        <div class="icon-grid">
          <div
            v-for="(icon, index) in filteredIcons"
            :key="index"
            :class="['icon-item', { selected: selectedIcon === icon }]"
            @click="selectIcon(icon)"
          >
            <SvgIcon :name="icon" :size="previewSize" :color="currentColor" />
            <div class="icon-name">{{ icon }}</div>
          </div>
        </div>

        <div v-if="filteredIcons.length === 0" class="no-results">没有找到匹配的图标</div>

        <div class="modal-footer">
          <button class="cancel-btn" @click="showModal = false">取消</button>
          <button class="confirm-btn" @click="confirmSelection" v-if="selectedIcon">确认选择</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | null // v-model绑定的图标名称
    placeholder?: string // 未选择时的占位文本
    triggerColor?: string // 触发按钮的颜色
    triggerSize?: number // 触发按钮的图标大小
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

// 假设这是从全局导入的图标列表（实际项目中应从文件系统或API获取）
const iconList = ref([
  'home',
  'search',
  'user',
  'settings',
  'heart',
  'star',
  'lock',
  'bell',
  'camera',
  'message',
  'phone',
  'mail',
  'location',
  'calendar',
  'bookmark',
  'download',
  'upload',
  'share',
  'reset',
  'info',
  'close',
  'menu',
  'arrow-left',
  'arrow-right',
  'plus',
  'check',
  'delete',
  'edit',
  'filter',
  'download-cloud',
  'upload-cloud',
  'image',
  'video',
  'music',
  'file',
  'folder',
  'trash-2',
  'book-open',
  'user-plus',
  'users',
  'activity',
  'compass',
  'map-pin',
  'navigation',
  'crop',
  'layers',
  'copy',
  'external-link',
  'help-circle',
  'link',
])

// 状态管理
const showModal = ref(false)
const searchTerm = ref('')
const currentColor = ref('#42b883')
const previewSize = ref(48)
const selectedIcon = ref<string | null>(props.modelValue || null)

// 颜色筛选选项
const colorFilters = ref([
  '#42b883', // 主题绿色
  '#ff6b6b', // 红色
  '#4dabf7', // 蓝色
  '#ffd43b', // 黄色
  '#7950f2', // 紫色
  '#212529', // 黑色
])

// 过滤后的图标列表
const filteredIcons = computed(() => {
  if (!searchTerm.value) {
    return iconList.value
  }

  return iconList.value.filter((icon) => icon.toLowerCase().includes(searchTerm.value.toLowerCase()))
})

// 选择图标
function selectIcon(icon: string) {
  selectedIcon.value = icon
}

// 确认选择
function confirmSelection() {
  if (selectedIcon.value) {
    emit('update:modelValue', selectedIcon.value)
    emit('change', selectedIcon.value)
  }
  showModal.value = false
}

// 监听外部变化
watch(
  () => props.modelValue,
  (val) => {
    selectedIcon.value = val || null
  },
)
</script>

<style scoped>
.icon-picker {
  position: relative;
}

.trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 8px 16px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 42px;
}

.trigger:hover {
  border-color: #c0c4cc;
}

.selected-icon {
  display: flex;
  align-items: center;
  gap: 10px;
}

.placeholder {
  color: #999;
}

.arrow-icon {
  margin-left: 10px;
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
}

.modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
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
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background-color: #f5f5f5;
}

.search-container {
  position: relative;
  padding: 16px 24px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.search-icon-container {
  position: absolute;
  left: 36px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 12px 20px 12px 40px;
  border: 1px solid #dcdfe6;
  border-radius: 30px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.2);
}

.clear-btn {
  position: absolute;
  right: 36px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.filters {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.color-filters {
  display: flex;
  gap: 8px;
}

.color-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.color-btn:hover {
  transform: scale(1.1);
}

.color-btn.active {
  border-color: #42b883;
  box-shadow: 0 0 0 2px #42b883;
}

.size-slider {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slider-label {
  font-size: 14px;
  color: #666;
}

.slider {
  width: 100px;
}

.size-value {
  min-width: 40px;
  font-size: 14px;
  color: #666;
}

.icon-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 16px;
  padding: 24px;
  overflow-y: auto;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.icon-item:hover {
  background-color: rgba(66, 184, 131, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.icon-item.selected {
  background-color: rgba(66, 184, 131, 0.15);
  border: 1px solid rgba(66, 184, 131, 0.5);
}

.icon-name {
  font-size: 12px;
  margin-top: 12px;
  text-align: center;
  color: #555;
  word-break: break-word;
  line-height: 1.4;
}

.no-results {
  padding: 40px 20px;
  text-align: center;
  color: #999;
  font-size: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  background-color: #f8f9fa;
  border-top: 1px solid #eee;
  gap: 12px;
}

.cancel-btn {
  padding: 10px 20px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background-color: #f5f7fa;
}

.confirm-btn {
  padding: 10px 20px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.confirm-btn:hover {
  background-color: #3aa776;
}

.confirm-btn:disabled {
  background-color: #a0d9be;
  cursor: not-allowed;
}
</style>

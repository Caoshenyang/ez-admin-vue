<script lang="ts" setup>
import router, { HOME_PAGE } from '@/router';
import { useUserStore } from '@/stores/modules/userStore';
import type { WorkTab } from '@/types/theme';
import { ArrowDown, ArrowLeft, ArrowRight, CircleClose, Close } from '@element-plus/icons-vue';
import { storeToRefs } from 'pinia';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';


const userStore = useUserStore()
// 路由
const route = useRoute()
// 当前选中的标签
const activeTab = ref(route.path)
// 当前打开的所有标签
const { workTabList } = storeToRefs(userStore)

/**
 * 切换标签
 * @param tab 切换标签路径
 */
const changeTab = (tab: string) => {
  router.push(tab)
}

/**
 * 跳转页面前将当前路由添加进缓存
 */
onBeforeRouteUpdate(to => {
  activeTab.value = to.path
  addTab({
    title: to.meta.title + '',
    path: to.path
  })
})

/**
 * 添加标签导航
 * @param tab 添加标签
 */
const addTab = (tab: WorkTab) => {
  // 与当前tabList中的tab进行比对
  const noTab = workTabList.value.findIndex(t => t.path == tab.path) == -1
  // 如果当前标签列表中没有则添加
  if (noTab) {
    workTabList.value.push(tab)
  }
}

/**
 * 移除标签
 * @param tab 删除标签路径
 */
const removeTab = (tab: string) => {
  const tabs = [...workTabList.value]
  let active = activeTab.value
  // 判断当前关闭的是否为当前选中的tab
  if (active == tab) {
    tabs.forEach((tabItem, index) => {
      // 遍历寻找当前关闭的标签索引
      if (tabItem.path === tab) {
        // 将选中的标签标记为 下一个 或者 前一个 tab
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          active = nextTab.path
        }
      }
    })
  }
  // 更新 workTabList，去除掉关闭的标签
  workTabList.value = workTabList.value.filter(tabItem => tabItem.path != tab)
  activeTab.value = active
  changeTab(active)
}

/**
 * 关闭标签页操作
 * @param command 命令类型
 * @param currentTab 当前标签页（仅 closeLeft/closeRight 需要）
 */
const handleClose = (command: string, currentTab?: string) => {
  const homeTab = { title: '工作台', path: HOME_PAGE }
  const tabs = [...workTabList.value]
  let newActiveTab = activeTab.value

  switch (command) {
    case 'clearOther':
      // 保留首页和当前激活页
      workTabList.value = tabs.filter(tab => tab.path === HOME_PAGE || tab.path === newActiveTab)
      break
    case 'clearAll':
      // 重置为仅首页
      newActiveTab = HOME_PAGE
      workTabList.value = [homeTab]
      changeTab(HOME_PAGE)
      break
    case 'closeLeft':
      if (!currentTab) return
      // 找到当前标签的索引
      const leftIndex = tabs.findIndex(tab => tab.path === currentTab)
      if (leftIndex <= 0) return  // 左侧无标签可关闭
      // 保留：首页 + 当前及右侧标签
      workTabList.value = [
        homeTab,
        ...tabs.slice(leftIndex)
      ]

      // 如果当前激活标签被关闭，则自动切换
      if (newActiveTab !== HOME_PAGE && !workTabList.value.some(t => t.path === newActiveTab)) {
        newActiveTab = currentTab
        changeTab(currentTab)
      }
      break
    case 'closeRight':
      if (!currentTab) return
      // 找到当前标签的索引
      const rightIndex = tabs.findIndex(tab => tab.path === currentTab)
      if (rightIndex === -1 || rightIndex === tabs.length - 1) return  // 右侧无标签可关闭
      // 保留：首页 + 左侧及当前标签
      workTabList.value = [
        homeTab,
        ...tabs.slice(0, rightIndex + 1)
      ]
      break
    default:
      break
  }
  // 统一更新激活标签（如果未变化则不影响）
  activeTab.value = newActiveTab
}


</script>
<template>
  <div class="app-work-tab">
    <div class="tab-item">
      <el-check-tag class="work-tab-item" type="info" :checked="item.path === activeTab" v-for="item in workTabList"
        :key="item.path" @change="changeTab(item.path)">
        {{ item.title }}
        <el-link @click="removeTab(item.path)" v-if="item.path != HOME_PAGE" :underline="false" :icon="Close"></el-link>
      </el-check-tag>
    </div>
    <div class="tag-btn">
      <el-dropdown @command="handleClose">
        <div class="button">
          <el-icon>
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :icon="ArrowLeft" command="closeLeft">关闭左侧</el-dropdown-item>
            <el-dropdown-item :icon="ArrowRight" command="closeRight">关闭右侧</el-dropdown-item>
            <el-dropdown-item :icon="Close" command="clearOther">关闭其他</el-dropdown-item>
            <el-dropdown-item :icon="CircleClose" command="clearAll">关闭全部</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.app-work-tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tab-item {
  display: flex;
  gap: 10px;
  user-select: none;
}

.el-check-tag {
  background-color: white;
  // 加边框，去除默认样式
  border: 1px solid #e4e7ed;
  // 去除默认样式
  border-radius: 8px;
  // 去除默认样式
  padding: 0 10px;
  // 去除默认样式
  height: 32px;
  // 字体样式
  font-weight: 400;
}

.el-check-tag.el-check-tag--info.is-checked {
  background-color: white;
  color: #51a2ff;
}

.work-tab-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #f5f7fa;
    color: #51a2ff;
  }

}

.tag-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: white;
  border: 1px solid #e4e7ed;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #f5f7fa;
  }

  .button {
    padding: 6px;
  }
}
</style>

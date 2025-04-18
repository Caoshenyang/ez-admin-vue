<script setup lang="ts">
import router, { HOME_PAGE_NAME, HOME_PAGE } from '@/router'
import { useRoute, type RouteLocationMatched } from 'vue-router'

/** 生成数组数据 */
const breadcrumbData = ref<RouteLocationMatched[]>([])
const route = useRoute()

/** 获取可用于展示在面包屑上的路由数据（定义为 meta 里有 title 的就可以） */
const getBreadcrumbData = () => {
  breadcrumbData.value = route.matched.filter((item) => item.meta.title && item.meta.title != HOME_PAGE_NAME)
}

/** 监听路由变化 */
watch(
  route,
  () => {
    getBreadcrumbData()
  },
  { immediate: true }
)

/** 点击跳转 */
const onLinkClick = (path: string) => {
  router.push(path)
}
</script>
<template>
  <div class="app-breadcrumb">
    <el-breadcrumb separator="/">
      <!-- 默认有一个首页 -->
      <el-breadcrumb-item :to="{ path: HOME_PAGE }">
        <span class="redirect">{{ HOME_PAGE_NAME }}</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in breadcrumbData" :key="item.path">
        <!-- 最后一层，不可点击 -->
        <span v-if="index === breadcrumbData?.length - 1" class="no-redirect" :key="item.path + '-no-redirect'">
          {{ item.meta.title }}
        </span>
        <a v-else class="redirect" @click.prevent="onLinkClick(item.path)" :key="item.path + '-redirect'">
          {{ item.meta.title }}
        </a>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<style scoped lang="scss">
.app-breadcrumb {
  // 不让选择，光标影响体验
  user-select: none;
}

.redirect {
  cursor: pointer;
  font-weight: bold;
}

.no-redirect {
  cursor: not-allowed;
  font-weight: bold;
  color: #999;
}
</style>

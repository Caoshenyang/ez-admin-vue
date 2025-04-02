<script lang="ts" setup>
import { Refresh, Search, Setting } from '@element-plus/icons-vue';
import MenuForm from './MenuForm.vue';
import { selectMenuTreeApi } from '@/api/system/menu';
import type { MenuTreeVO } from '@/types/auth';
import type { MenuQuery } from '@/types/system';

/** 列表数据 */
const menuTableTreeData = ref<MenuTreeVO[]>([])
const menuFormDialogRef = ref()

/** 查询对象 */
const menuQuery = reactive<MenuQuery>({
  menuName: '',
  dateRange: []
})

// 刷新列表
const refreshList = async () => {
  await selectMenuTreeApi(menuQuery).then((data: MenuTreeVO[]) => {
    menuTableTreeData.value = data
  })
}


const handleAdd = () => {
  menuFormDialogRef.value.open()
}


</script>
<template>
  <div class="menu-container">
    <div class="search-bar">
      搜索区域
    </div>
    <div class="operation-bar">
      <div class="operation-button">
        <el-button type="primary" @click="handleAdd">新增菜单</el-button>
      </div>
      <div class="setting-button">
        <!-- 搜索显示/隐藏 -->
        <el-button :icon="Search" circle />
        <!-- 刷新列表数据 -->
        <el-button :icon="Refresh" circle />
        <!-- 展示列设置 -->
        <el-button :icon="Setting" circle />
      </div>
    </div>
    <div class="table-container">
      表单区域

    </div>
    <div class="pagination-container">
      分页区域
    </div>

    <MenuForm ref="menuFormDialogRef" @confirm="refreshList" />

  </div>
</template>


<style lang="scss" scoped>
.operation-bar {
  height: 40px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

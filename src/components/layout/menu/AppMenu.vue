<script setup lang="ts">
import router from '@/router'
import { ref } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import SubMenu from './SubMenu.vue'
import type { MenuTreeVO } from '@/types/auth'
import { useSettingStore } from '@/stores/modules/settingStore'


/***************************** 数据源 ******************************************/

const settingStore = useSettingStore()

// 菜单数据
const menus = ref<MenuTreeVO[]>([
  {
    menuId: 1,
    menuName: '系统管理',
    menuLabel: '系统管理',
    menuPerm: 'system',
    parentId: 0,
    menuType: 0,
    menuSort: 1,
    menuIcon: 'setting',
    menuPath: '/system',
    component: 'Layout',
    children: [
      {
        menuId: 2,
        menuName: '用户管理',
        menuLabel: '用户管理',
        menuPerm: 'system:user',
        parentId: 1,
        menuType: 1,
        menuSort: 1,
        menuIcon: 'user',
        menuPath: '/system/user',
        component: 'system/user/User.vue'
      },
      {
        menuId: 3,
        menuName: '角色管理',
        menuLabel: '角色管理',
        menuPerm: 'system:role',
        parentId: 1,
        menuType: 1,
        menuSort: 2,
        menuIcon: 'custom',
        menuPath: '/system/role',
        component: 'system/role/Role.vue'
      },
      {
        menuId: 4,
        menuName: '菜单管理',
        menuLabel: '菜单管理',
        menuPerm: 'system:menu',
        parentId: 1,
        menuType: 1,
        menuSort: 3,
        menuIcon: 'menu',
        menuPath: '/system/menu',
        component: 'system/menu/Menu.vue'
      },
      {
        menuId: 5,
        menuName: '部门管理',
        menuLabel: '部门管理',
        menuPerm: 'system:dept',
        parentId: 1,
        menuType: 1,
        menuSort: 4,
        menuIcon: 'office-building',
        menuPath: '/system/dept',
        component: 'system/dept/Dept.vue'
      },
      {
        menuId: 6,
        menuName: '字典管理',
        menuLabel: '字典管理',
        menuPerm: 'system:dict',
        parentId: 1,
        menuType: 1,
        menuSort: 5,
        menuIcon: 'order',
        menuPath: '/system/dict',
        component: 'system/dict/Dict.vue'
      },
      {
        menuId: 7,
        menuName: '参数管理',
        menuLabel: '参数管理',
        menuPerm: 'system:config',
        parentId: 1,
        menuType: 1,
        menuSort: 6,
        menuIcon: 's-operation',
        menuPath: '/system/config',
        component: 'system/config/Config.vue'
      }]
  }
])
const route = useRoute()
// 默认选中
const defaultActive = ref(route.path)

/***************************** 方法区 ******************************************/

// 监听路由变化
onBeforeRouteUpdate((to) => {
  defaultActive.value = to.path
})
const handleSelect = (e: string) => {
  router.push(e)
}
</script>
<template>
  <el-menu :default-active="defaultActive" @select="handleSelect" :unique-opened="true" class="side-menu"
    :collapse="settingStore.isCollapse">
    <el-menu-item index="/dashboard/workbench">
      <el-icon>
        <HomeFilled />
      </el-icon>
      <span> 工作台 </span>
    </el-menu-item>
    <SubMenu :menu-data="menus" />
  </el-menu>
</template>
<style lang="scss" scoped>
.el-menu {
  border: 0;
}

// 展开的宽度
.el-menu:not(.el-menu--collapse) {
  width: 100%;
}

// 折叠后宽度
.el-menu--collapse {
  width: 100%;
}
</style>

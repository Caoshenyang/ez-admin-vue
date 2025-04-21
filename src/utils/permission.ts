// src/main.ts 或 src/utils/auth.ts
import { useUserStore } from '@/stores/modules/userStore'
import type { App } from 'vue'

const userStore = useUserStore()
/**
 * 权限检查函数
 * @param code 权限标识符
 * @returns 是否有权限
 */
export const hasPermission = (code: string): boolean => {
  // 从Pinia/Vuex或本地存储获取用户权限列表
  const userPermissions = [...userStore.userInfo.permissions] // 示例权限列表
  return userPermissions.includes(code)
}

export const setupAuth = (app: App) => {
  // 挂载全局方法
  app.config.globalProperties.$auth = { hasPermission }

  // 注册指令
  app.directive('permission', {
    mounted(el, binding) {
      if (!hasPermission(binding.value)) {
        el.remove()
      }
    }
  })
}

// 声明类型扩展（TS支持）
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $auth: {
      hasPermission: typeof hasPermission
    }
  }
}

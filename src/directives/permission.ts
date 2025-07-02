import { useUserStore } from '@/stores/modules/user'
import { type App, type Directive } from 'vue'

/**
 * 权限指令（无权限则移除元素）
 * 使用: v-permission="'system:user:add'"
 */
const permissionDirective: Directive<HTMLElement, string> = {
  mounted(el, binding: DirectiveBinding<string | string[]>) {
    // 1. 获取用户权限存储
    const userStore = useUserStore()
    // 2. 解构出指令绑定的值
    const { value } = binding
    // 3. 验证权限值是否存在
    if (!value) {
      throw new Error(
        "需要指定权限标识，如 v-permission=\"'user:create'\" 或 v-permission=\"['user:create', 'user:edit']\"",
      )
    }
    // 5. 检查用户是否拥有任一权限
    const hasPermission = userStore.hasPermission(value)

    // 6. 无权限时移除元素
    if (!hasPermission) {
      el.parentNode?.removeChild(el)
    }
  },
}

export function setupPermissionDirective(app: App) {
  app.directive('permission', permissionDirective)
}

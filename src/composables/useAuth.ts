import { ref, provide, inject, computed } from 'vue'
import type { MenuTreeVO, ButtonConfig } from '@/types/auth'

// 创建唯一的injection key
const AuthInjectionKey = Symbol('auth')

/**
 * 权限服务上下文类型
 */
interface AuthContext {
  buttons: Readonly<Ref<Map<string, ButtonConfig>>>
  init: (menuTree: MenuTreeVO[]) => void
  hasPermission: (key: string) => boolean
  getButtonConfig: (key: string) => ButtonConfig | undefined
}

/**
 * 提供权限上下文（应在根组件调用）
 */
export function provideAuth() {
  // 使用ref保证响应式
  const buttons = ref(new Map<string, ButtonConfig>())

  /**
   * 从菜单树提取按钮配置
   */
  const extractButtons = (menuTree: MenuTreeVO[]): Map<string, ButtonConfig> => {
    const map = new Map<string, ButtonConfig>()

    const traverse = (nodes: MenuTreeVO[]) => {
      nodes.forEach((node) => {
        if (node.menuType === 3) {
          // 按钮类型
          map.set(node.menuId, {
            id: node.menuId,
            name: node.menuName,
            permission: node.menuPerm || '',
            icon: node.menuIcon || ''
          })
        }
        if (node.children) traverse(node.children)
      })
    }

    traverse(menuTree)
    return map
  }

  /**
   * 初始化权限数据
   */
  const init = (menuTree: MenuTreeVO[]) => {
    buttons.value = extractButtons(menuTree)
  }

  /**
   * 检查是否有权限
   */
  const hasPermission = (key: string) => {
    return buttons.value.has(key)
  }

  /**
   * 获取按钮配置
   */
  const getButtonConfig = (key: string) => {
    return buttons.value.get(key)
  }

  // 提供上下文给子组件
  provide(AuthInjectionKey, {
    buttons: computed(() => buttons.value), // 只读
    init,
    hasPermission,
    getButtonConfig
  })

  return { init }
}

/**
 * 使用权限上下文
 */
export function useAuth(): AuthContext {
  const context = inject<AuthContext>(AuthInjectionKey)
  if (!context) {
    throw new Error('useAuth must be used within a component that calls provideAuth')
  }
  return context
}

import { authApi } from '@/api/system/auth'
import { useMenuTreeToActionItem } from '@/composables/useButtonActions'
import { MenuType } from '@/enums/appEnums'
import { HOME_PAGE } from '@/router'
import type { LoginDTO, MenuTreeVO, UserInfoVO } from '@/types/auth'
import type { ActionItem } from '@/types/common'
import type { WorkTab } from '@/types/theme'
import { getToken, removeToken, setToken } from '@/utils/cookie'
import { defineStore } from 'pinia'

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useUserStore = defineStore('userInfo', {
  state: () => ({
    userInfo: {} as UserInfoVO,
    workTabList: [{ title: '工作台', path: HOME_PAGE }] as WorkTab[],
    buttonRecords: {} as Record<string, ActionItem[]>
  }),
  getters: {
    avatar: (state) => {
      return state.userInfo.avatar || '/images/avatar_boy.jpeg'
    },
    hasPermission: (state) => (value: string | string[]) => {
      if (typeof value === 'string') {
        return state.userInfo.permissions.includes(value)
      }
      return value.some((permission) => state.userInfo.permissions.includes(permission))
    }
  },
  actions: {
    /** 是否登录 */
    isLogin() {
      return !!getToken()
    },

    /**
     * 登录
     *
     * @param loginDTO 登录参数
     */
    async login(loginDTO: LoginDTO) {
      const token = await authApi.login(loginDTO)
      console.log(token)

      setToken(token)
    },

    /** 获取用户信息 */
    async getUserInfo() {
      try {
        const userInfo = await authApi.getUserInfo()
        this.userInfo = userInfo
      } catch (error) {
        this.logout()
        console.log(error)
      }
    },
    // 退出登录
    async logout() {
      // 请求后端接口
      // await logout()

      // 清除数据和状态
      removeToken()
      this.$reset()
    },
    // 获取当前路由的按钮
    getButtons(routePath: string): ActionItem[] {
      return this.buttonRecords[routePath] || []
    },
    // 收集按钮并存入缓存
    cacheButtons(fullPath: string, menu: MenuTreeVO) {
      if (menu.menuType === MenuType.BUTTON) return
      // 存入当前路由的按钮
      if (menu.children?.length) {
        const buttons = this.collectButton(menu.children)
        if (buttons.length) {
          this.buttonRecords[fullPath] = buttons
        }
      }
    },
    // 辅助方法：收集按钮
    collectButton(menuList: MenuTreeVO[]): ActionItem[] {
      return menuList.flatMap((item) =>
        item.menuType === MenuType.BUTTON ? [useMenuTreeToActionItem(item)] : this.collectButton(item.children || [])
      )
    }
  },
  persist: true
})

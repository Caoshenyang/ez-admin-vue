import { authApi } from '@/api/auth'
import { HOME_PAGE } from '@/router'
import type { LoginDTO } from '@/types/auth'
import type { WorkTab } from '@/types/theme'
import type { UserInfoVO } from '@/types/user'
import { defineStore } from 'pinia'

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useUserStore = defineStore('userInfo', {
  state: () => ({
    userInfo: {} as UserInfoVO,
    workTabList: [{ title: '工作台', path: HOME_PAGE }] as WorkTab[],
  }),
  getters: {},
  actions: {
    /**
     * 登录
     *
     * @param loginDTO 登录参数
     */
    async login(loginDTO: LoginDTO) {
      await authApi.login(loginDTO)
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
      // removeToken()
      this.$reset()
    },
  },
  persist: true,
})

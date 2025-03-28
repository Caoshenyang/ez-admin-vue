import { getUserInfoApi, loginApi } from '@/api/auth'
import type { LoginDTO, UserInfoVO } from '@/types/auth'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
export const useUserStore = defineStore(
  'userStore',
  () => {
    /**
     * 用户信息
     */
    const userInfo = ref<UserInfoVO>({
      avatar: '',
      nickname: '',
      userId: '',
      username: '',
      permissions: [],
      menus: [],
    })

    const avatar = computed(() => {
      return userInfo.value.avatar || '/images/avatar_boy.jpeg'
    })

    /**
     * 是否登录
     */
    const isLogin = () => {
      return !!getToken()
    }

    /**
     * 登录
     *
     * @param loginDTO 登录参数
     */
    const login = async (loginDTO: LoginDTO) => {
      const token = await loginApi(loginDTO)
      setToken(token)
    }

    /**
     * 退出登录
     */
    const logout = async () => {
      // 请求后端接口
      // await logout()
      removeToken()
      $reset()
    }

    /**
     * 获取用户信息
     */
    const getUserInfo = async () => {
      await getUserInfoApi()
        .then((res) => {
          userInfo.value = res
        })
        .catch(() => {
          logout()
          ElMessage.error('登录认证已过期，请重新登录。')
        })
    }

    const $reset = () => {
      Object.assign(userInfo, {
        avatar: '',
        deptId: 0,
        nickname: '',
        permissions: [],
        routers: [],
        userId: '',
        username: '',
      })
    }

    return {
      userInfo,
      avatar,
      isLogin,
      login,
      logout,
      getUserInfo,
      $reset,
    }
  },
  {
    persist: true,
  },
)

import type { LoginDTO, TokenInfoVO, UserInfoVO } from '@/types/auth'
import request from '@/utils/request'

/**
 * 登录
 * @param data LoginParam
 * @returns token
 */
export const loginApi = (data: LoginDTO) => {
  return request<TokenInfoVO>({
    method: 'POST',
    url: '/auth/login',
    data: { ...data },
  })
}

/**
 * 获取当前用户信息
 * @returns UserInfo
 */
export const getUserInfoApi = () => {
  return request<UserInfoVO>({
    method: 'POST',
    url: '/auth/userInfo',
  })
}

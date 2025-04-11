import type { LoginDTO, TokenInfoVO, UserInfoVO } from '@/types/auth'
import http from '@/utils/request'

export const authApi = {
  // 登录
  login: (data: LoginDTO) => http.post<TokenInfoVO>('/auth/login', data),

  // 获取用户信息
  getUserInfo: () => http.get<UserInfoVO>('/auth/userInfo')
}

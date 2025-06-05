import type { LoginDTO } from '@/types/auth'
import type { UserInfoVO } from '@/types/user'
import http from '@/utils/request'

export const authApi = {
  // 登录
  login: (data: LoginDTO) => http.post('/auth/login', data),

  // 获取用户信息
  getUserInfo: () => http.get<UserInfoVO>('/auth/userInfo'),
}

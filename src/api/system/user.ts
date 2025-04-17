import type { PageQuery, PageVO } from '@/types/common'
import type { UserForm, UserListVO, UserQuey } from '@/types/system'
import http from '@/utils/request'

export const userApi = {
  // 获取用户列表
  getUserList: (data?: PageQuery<UserQuey>) => http.post<PageVO<UserListVO>>('/system/user/page', data),
  // 获取用户信息
  getUserById: (userId: string) => http.get<UserForm>('/system/user/getUserById/' + userId),

  // 创建用户
  createUser: (data: UserForm) => http.post('/system/user/create', data),

  // 更新用户
  updateUser: (data: UserForm) => http.post('/system/user/update', data),

  // 删除用户
  deleteUser: (id: string) => http.delete('/system/user/delete/' + id)
}

import type { PageQuery, PageVO } from '@/types/common'
import type { RoleDetailVO, RoleForm, RoleListVO, RoleMenuRelation, RoleQuery } from '@/types/system'
import http from '@/utils/request'

export const roleApi = {
  // 查询角色列表
  selectRoleList: (data?: PageQuery<RoleQuery>) => http.post<PageVO<RoleListVO>>('/system/role/page', data),

  // 查询角色详情
  getRoleById: (id: string) => http.get<RoleForm>('/system/role/getRoleById/' + id),

  // 创建角色
  createRole: (data: RoleDetailVO) => http.post('/system/role/create', data),

  // 更新角色
  updateRole: (data: RoleForm) => http.post('/system/role/update', data),

  // 删除角色
  deleteRole: (id: string) => http.delete('/system/role/delete/' + id),

  // 批量删除角色
  deleteBatchRole: (ids: string[]) => http.delete(`/system/role/deleteBatch`, ids),

  // 查询角色菜单权限
  selectRoleMenu: (roleId: string) => http.get<string[]>('/system/role/findMenusByRoleId/' + roleId),

  // 保存角色菜单权限
  saveRoleMenu: (data: RoleMenuRelation) => http.post('/system/role/saveRoleMenus', data)
}

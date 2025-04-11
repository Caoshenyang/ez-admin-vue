import type { PageQuery, PageVO } from '@/types/common'
import type { RoleListVO, RoleQuery } from '@/types/system'
import http from '@/utils/request'

export const roleApi = {
  // 查询角色列表
  selectRoleList: (data?: PageQuery<RoleQuery>) => http.post<PageVO<RoleListVO>>('/system/role/page', data),

  // 查询角色菜单权限
  selectRoleMenu: (roleId: string) => http.get<PageVO<RoleListVO>>('/system/role/menu/' + roleId)
}

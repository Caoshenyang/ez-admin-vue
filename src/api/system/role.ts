import type { PageQuery, PageVO } from '@/types/common'
import type { RoleListVO, RoleQuery } from '@/types/system'
import http from '@/utils/request'

export const roleApi = {
  // 查询角色列表
  selectRoleList: (data?: PageQuery<RoleQuery>) => http.post<PageVO<RoleListVO>>('/system/role/page', data)
}

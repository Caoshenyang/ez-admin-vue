import type { MenuTreeVO } from '@/types/auth'
import type { MenuDetailVO, MenuForm, MenuQuery } from '@/types/system'
import http from '@/utils/request'

export const menuApi = {
  // 获取菜单树
  selectMenuTree: (data?: MenuQuery) => http.post<MenuTreeVO[]>('/system/menu/tree', data),

  // 根据菜单id删除菜单
  getMenuById: (menuId: string) => http.get<MenuDetailVO>(`system/menu/${menuId}`),

  // 新增菜单
  createMenu: (data?: MenuForm) => http.post('/system/menu/save', data),

  // 编辑菜单
  updateMenu: (data?: MenuForm) => http.post('/system/menu/update', data),

  // 删除菜单
  deleteMenu: (menuId: string) => http.delete(`/system/menu/delete/${menuId}`),

  // 批量删除菜单
  deleteBatchMenu: (menuIds: string[]) => http.delete(`/system/menu/deleteBatch`, menuIds)
}

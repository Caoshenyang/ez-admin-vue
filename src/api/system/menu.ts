import type { MenuTreeVO } from '@/types/auth'
import type { MenuDetailVO, MenuForm, MenuQuery } from '@/types/system'
import request from '@/utils/request'

/**
 * 获取菜单树
 * @returns  MenuTreeVO[]
 */
export const selectMenuTreeApi = (data?: MenuQuery) => {
  return request<MenuTreeVO[]>({
    method: 'POST',
    url: '/system/menu/tree',
    data: { ...data },
  })
}

/**
 * 新增菜单
 * @param menuCreateDTO 菜单新增
 * @returns  string
 */
export const createMenuApi = (menuCreateDTO: MenuForm) => {
  return request<string>({
    method: 'POST',
    url: '/system/menu/save',
    data: { ...menuCreateDTO },
  })
}

/**
 * 编辑菜单
 * @param menuUpdateDTO 编辑菜单
 * @returns  string
 */
export const updateMenuApi = (menuUpdateDTO: MenuForm) => {
  return request<string>({
    method: 'POST',
    url: '/system/menu/update',
    data: { ...menuUpdateDTO },
  })
}

/**
 * 根据菜单id删除菜单
 * @param menuId 菜单ID
 * @returns  string
 */
export const deleteMenuApi = (menuId: number) => {
  return request<string>({
    method: 'DELETE',
    url: `/system/menu/delete/${menuId}`,
  })
}

/**
 * 根据菜单id删除菜单
 * @param menuId 菜单ID
 * @returns  string
 */
export const getMenuByIdApi = (menuId: number) => {
  return request<MenuDetailVO>({
    method: 'GET',
    url: `system/menu/${menuId}`,
  })
}

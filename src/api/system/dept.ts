import type { DeptDetailVO, DeptForm, DeptQuery, DeptTreeVO } from '@/types/system'
import http from '@/utils/request'

export const deptApi = {
  // 获取部门树列表
  getDeptList: (data?: DeptQuery) => http.post<DeptTreeVO[]>('/system/dept/tree', data),

  // 获取选择部门列表
  getDeptTreeList: () => http.get<DeptDetailVO[]>('/system/dept/tree/select'),

  // 根据部门id删除部门
  getDeptById: (deptId: string) => http.get<DeptDetailVO>(`system/dept/${deptId}`),

  // 新增部门
  createDept: (data?: DeptForm) => http.post('/system/dept/create', data),

  // 编辑部门
  updateDept: (data?: DeptForm) => http.post('/system/dept/update', data),

  // 删除部门
  deleteDept: (deptId: string) => http.delete(`/system/dept/delete/${deptId}`),

  // 批量删除部门
  deleteBatchDept: (deptIds: string[]) => http.delete(`/system/dept/delete/batch`, deptIds)
}

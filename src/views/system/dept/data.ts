import type { DeptForm, DeptQuery, DeptTreeVO } from '@/types/system'

// 树型节点类型
export const treeProps = {
  children: 'children',
  label: 'deptName',
  value: 'deptId'
}

export const INIT_QUERY: DeptQuery = {
  deptName: ''
}

export const INIT_FORM_DATA: DeptForm = {
  deptId: '',
  deptName: '',
  deptSort: 999,
  status: 0,
  ancestors: '',
  parentId: '0',
  description: ''
}

export const INIT_DEPT_TREE_DATA: DeptTreeVO = {
  deptId: '0',
  parentId: '0',
  deptName: '顶级部门',
  ancestors: '0',
  deptSort: 999,
  status: 0,
  description: '',
  children: []
}

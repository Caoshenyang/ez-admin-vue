import type { ActionItem, FormField } from '@/components/layout/actionbar'
import type { DeptForm, DeptQuery, DeptTreeVO } from '@/types/system'
import { Delete, EditPen, Plus } from '@element-plus/icons-vue'

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
  children: []
}

// 筛选条件
export const FILTERS: FormField[] = [
  {
    label: '部门名称',
    prop: 'deptName',
    type: 'input',
    props: {
      placeholder: '请输入部门名称'
    }
  }
]

// 操作按钮
export const ACTION_BUTTONS: ActionItem[] = [
  {
    name: 'add',
    label: '新增',
    type: 'primary',
    icon: Plus,
    tooltip: '添加新数据'
  },
  {
    name: 'edit',
    label: '编辑',
    type: 'success',
    icon: EditPen,
    tooltip: '编辑'
  },
  {
    name: 'delete',
    label: '删除',
    type: 'danger',
    icon: Delete,
    tooltip: '删除选中数据'
  }
]

// 表单设置
export const FORM_FIELDS: FormField[] = [
  {
    label: '部门名称',
    prop: 'deptName',
    type: 'input',
    rules: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
    props: {
      placeholder: '请输入部门名称'
    }
  },
  {
    label: '上级部门',
    prop: 'parentId',
    type: 'treeSelect',
    rules: [{ required: true, message: '上级部门不能为空', trigger: 'blur' }],
    props: {
      placeholder: '请选择上级部门',
      props: {
        label: 'deptName',
        value: 'deptId',
        children: 'children',
        data: []
      }
    }
  },
  {
    prop: 'status',
    label: '状态',
    type: 'radio',
    options: [
      { label: '正常', value: 1 },
      { label: '停用', value: 0 }
    ]
  },
  {
    label: '排序',
    prop: 'deptSort',
    type: 'number',
    rules: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
    props: {
      placeholder: '请输入排序'
    }
  },
  {
    prop: 'description',
    label: '备注',
    type: 'textarea',
    labelWidth: '50px',
    span: 24,
    props: {
      type: 'textarea',
      rows: 3,
      showWordLimit: true,
      maxlength: 200
    }
  }
]

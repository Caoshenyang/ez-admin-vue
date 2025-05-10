import type { EZFormProps, SmartActionBarProps, TableProps } from '@/types/common'
import type { DeptForm } from '@/types/system'

export const name = '部门'

export const actionsConfig: SmartActionBarProps = {
  queryParams: [
    {
      prop: 'deptName',
      label: '部门名称',
      type: 'input'
    }
  ],
  actions: []
}

export const formConfig: EZFormProps<DeptForm> = {
  formData: {
    deptId: '',
    deptName: '',
    deptSort: 999,
    status: 0,
    ancestors: '',
    parentId: '0',
    description: ''
  },
  fields: [
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
}

export const tableConfig: TableProps = {
  showSelection: true,
  columns: [
    { prop: 'deptName', label: '部门名称' },
    { prop: 'deptSort', label: '排序' },
    {
      prop: 'status',
      label: '状态',
      component: 'tag',
      formatter: (row) => (row.status ? '启用' : '停用')
    },
    { prop: 'description', label: '描述' },
    { prop: 'createTime', label: '创建时间' }
  ],
  rowKey: 'deptId',
  treeProps: { children: 'children', hasChildren: 'hasChild' }
}

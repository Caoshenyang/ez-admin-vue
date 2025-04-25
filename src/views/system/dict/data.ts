import type { ActionItem, FormField } from '@/components/layout/actionbar'
import { Delete, Download, EditPen, Plus } from '@element-plus/icons-vue'

export const roleFormField: FormField[] = [
  {
    prop: 'roleName',
    label: '角色名称',
    type: 'input',
    rules: [
      { required: true, message: '请输入角色名称', trigger: 'blur' },
      { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' }
    ],
    props: {
      placeholder: '请输入角色名称',
      clearable: true
    }
  },
  {
    prop: 'roleCode',
    label: '角色编码',
    type: 'input',
    rules: [
      { required: true, message: '请输入角色编码' },
      { pattern: /^[A-Z_]+$/, message: '只能包含大写字母和下划线' }
    ]
  },
  {
    prop: 'status',
    label: '状态',
    labelWidth: '50px',
    type: 'radio',
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ]
  },
  {
    prop: 'dataScope',
    label: '数据权限',
    type: 'select',
    options: [
      { label: '全部数据', value: 1 },
      { label: '部门数据', value: 2 },
      { label: '仅本人数据', value: 3 }
    ]
  },
  {
    prop: 'remark',
    label: '备注',
    type: 'textarea',
    span: 24,
    labelWidth: '50px',
    props: {
      type: 'textarea',
      rows: 3,
      showWordLimit: true,
      maxlength: 200
    }
  }
]

// 操作按钮配置
export const actions: ActionItem[] = [
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
    name: 'batchDelete',
    label: '批量删除',
    type: 'danger',
    icon: Delete,
    tooltip: '删除选中数据'
  },
  {
    name: 'print',
    label: '导出',
    type: 'warning',
    icon: Download,
    tooltip: '导出'
  }
]

// 筛选字段配置
export const filters: FormField[] = [
  // 基础筛选字段
  {
    prop: 'name',
    label: '姓名',
    type: 'input'
  },
  {
    prop: 'gender',
    label: '性别',
    type: 'select',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' }
    ],
    span: 4
  },
  {
    prop: 'birthDate',
    label: '出生日期',
    type: 'date'
  },

  // 扩展筛选字段（默认折叠）
  {
    prop: 'email',
    label: '邮箱',
    type: 'input',
    collapsed: true
  },
  {
    prop: 'createTime',
    label: '创建时间范围',
    type: 'daterange',
    collapsed: true
  },

  // 系统字段（不会显示在UI上）
  {
    prop: 'isVip',
    label: 'VIP用户',
    type: 'select',
    system: true,
    options: [
      { label: '是', value: 1 },
      { label: '否', value: 0 }
    ]
  }
]

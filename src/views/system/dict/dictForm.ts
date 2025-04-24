import type { FormSchema } from '@/components/form'

export const roleFormSchema: FormSchema = {
  title: '角色配置',
  columns: 2,
  fields: [
    {
      name: 'roleName',
      label: '角色名称',
      type: 'input',
      required: true,
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
      name: 'roleCode',
      label: '角色编码',
      type: 'input',
      required: true,
      rules: [
        { required: true, message: '请输入角色编码' },
        { pattern: /^[A-Z_]+$/, message: '只能包含大写字母和下划线' }
      ]
    },
    {
      name: 'status',
      label: '状态',
      type: 'radio',
      defaultValue: 1,
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    },
    {
      name: 'dataScope',
      label: '数据权限',
      type: 'select',
      options: [
        { label: '全部数据', value: 1 },
        { label: '部门数据', value: 2 },
        { label: '仅本人数据', value: 3 }
      ]
    },
    {
      name: 'remark',
      label: '备注',
      type: 'textarea',
      span: 24,
      props: {
        rows: 3,
        showWordLimit: true,
        maxlength: 200
      }
    }
  ]
}

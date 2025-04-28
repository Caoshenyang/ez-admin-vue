import type { CrudConfig } from '@/types/crud'
import { msgSuccess } from '@/utils/message'
import { cloneDeep } from 'lodash-es'

export const useCrud = <F, Q, T>(config: CrudConfig<F, Q, T>) => {
  const loading = ref(false)
  const data = ref<T>() as Ref<T> // 显式声明 Ref<T[]>
  const selectedRows = ref<T[]>([]) as Ref<T[]>
  const queryParams = ref<Q>({} as Q)
  const formData = ref(cloneDeep(config.form.initialData)) as Ref<F>
  const dialog = ref({
    visible: false,
    title: '',
    mode: 'create' as 'create' | 'edit'
  })

  // 加载列表数据
  const loadData = async () => {
    loading.value = true
    try {
      data.value = await config.apis.list(queryParams.value)
    } finally {
      loading.value = false
    }
  }

  // 新增
  const handleCreate = () => {
    formData.value = cloneDeep(config.form.initialData)
    dialog.value = { visible: true, title: `新增${config.name}`, mode: 'create' }
  }

  // 编辑
  const handleEdit = (row: F) => {
    formData.value = cloneDeep(row)
    dialog.value = { visible: true, title: `编辑${config.name}`, mode: 'edit' }
  }

  // 删除
  const handleDelete = async (ids: string[]) => {
    await ElMessageBox.confirm(`确定删除选中的${config.name}吗？`, '删除确认')
    await config.apis.delete(ids)
    msgSuccess('删除成功')
    await loadData()
  }

  // 提交
  const handleSubmit = async () => {
    let data = cloneDeep(formData.value)

    if (config.hooks?.beforeCreate && dialog.value.mode === 'create') {
      data = await config.hooks.beforeCreate(data)
    }

    if (config.hooks?.beforeUpdate && dialog.value.mode === 'edit') {
      data = await config.hooks.beforeUpdate(data)
    }

    const api = dialog.value.mode === 'create' ? config.apis.create : config.apis.update

    await api(data)
    msgSuccess('删除成功')
    dialog.value.visible = false
    await loadData()
    config.hooks?.afterSubmit?.()
  }

  return {
    loading,
    data,
    selectedRows,
    queryParams,
    formData,
    dialog,
    loadData,
    handleCreate,
    handleEdit,
    handleDelete,
    handleSubmit
  }
}

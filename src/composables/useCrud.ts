import { msgSuccess } from '@/utils/message'
import { cloneDeep } from 'lodash-es'

export const useCrud = <F, Q, T>(config: CrudConfig<F, Q, T>) => {
  // 使用 ref 定义所有状态
  const loading = ref(false)
  const data = ref<T[] | T>()
  const queryParams = ref<Q>({} as Q)
  const formData = ref<F>(cloneDeep(config.form.initialData))
  const dialog = ref({
    visible: false,
    title: '',
    mode: 'create' as 'create' | 'edit'
  })

  // 加载列表数据
  const loadData = async () => {
    loading.value = true
    try {
      const params = { ...queryParams.value }
      data.value = await config.apis.list(params)
    } catch (error) {
      console.error('加载数据失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 新增
  const handleCreate = () => {
    resetForm()
    dialog.value = {
      visible: true,
      title: `新增${name}`,
      mode: 'create'
    }
  }

  // 编辑
  const handleEdit = (row: Partial<F>) => {
    const initialData = cloneDeep(config.form.initialData)
    formData.value = { ...initialData, ...row } as F
    dialog.value = {
      visible: true,
      title: `编辑${config.name}`,
      mode: 'edit'
    }
  }

  // 删除
  const handleDelete = async (ids: string[]) => {
    try {
      await ElMessageBox.confirm(`确定删除选中的${config.name}吗？`, '删除确认')
      await config.apis.delete(ids)
      msgSuccess('删除成功')
      await loadData()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除失败:', error)
      }
    }
  }

  // 提交
  const handleSubmit = async () => {
    try {
      let submitData = cloneDeep(formData.value)

      // 预处理钩子
      if (dialog.value.mode === 'create' && config.hooks?.beforeCreate) {
        submitData = await config.hooks.beforeCreate(submitData)
      } else if (dialog.value.mode === 'edit' && config.hooks?.beforeUpdate) {
        submitData = await config.hooks.beforeUpdate(submitData)
      }

      // 执行API调用
      const api = dialog.value.mode === 'create' ? config.apis.create : config.apis.update
      await api(submitData)

      msgSuccess('操作成功')
      dialog.value.visible = false
      await loadData()

      config.hooks?.afterSubmit?.()
    } catch (error) {
      console.error('提交失败:', error)
      throw error
    }
  }

  // 重置表单
  const resetForm = () => {
    formData.value = cloneDeep(config.form.initialData)
  }

  return {
    loading,
    data,
    queryParams,
    formData,
    dialog,
    loadData,
    handleCreate,
    handleEdit,
    handleDelete,
    handleSubmit,
    resetForm
  }
}

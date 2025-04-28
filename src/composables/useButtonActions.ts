// composables/useButtonActions.ts
import type { ActionItem } from '@/components/layout/actionbar'

/**
 * 根据选择的行，设置按钮禁用状态
 * @param buttonDefinitions 按钮定义
 * @param selectedRows  选中的行
 * @returns 根据选择的行，设置按钮禁用状态，返回按钮定义
 */
export function useButtonActions(buttonDefinitions: ActionItem[], selectedRows: Ref<unknown[]>): ActionItem[] {
  const defaultStrategies: Record<string, boolean> = {
    add: false,
    edit: selectedRows.value.length !== 1,
    delete: selectedRows.value.length === 0
  }

  return buttonDefinitions.map((button) => ({
    ...button,
    disabled: defaultStrategies[button.name] || button.disabled
  }))
}

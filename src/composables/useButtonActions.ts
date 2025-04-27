// composables/useButtonActions.ts
import type { ActionItem } from '@/components/layout/actionbar'

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

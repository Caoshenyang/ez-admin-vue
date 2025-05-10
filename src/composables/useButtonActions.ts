// composables/useButtonActions.ts
import type { MenuTreeVO } from '@/types/auth'
import type { ActionItem } from '@/types/common'

/**
 * 根据选择的行，设置按钮禁用状态
 * @param buttonDefinitions 按钮定义
 * @param selectedRows  选中的行
 * @returns 根据选择的行，设置按钮禁用状态，返回按钮定义
 */
export function useButtonActions(buttonDefinitions: ActionItem[], selectedRows: unknown[]): ActionItem[] {
  const defaultStrategies: Record<string, boolean> = {
    add: false,
    edit: selectedRows.length !== 1,
    delete: selectedRows.length === 0
  }

  return buttonDefinitions.map((button) => ({
    ...button,
    disabled: defaultStrategies[button.emit] || button.disabled
  }))
}

/**
 * 将 MenuTreeVO 类型的按钮转成 ActionItem 类型
 */
export function useMenuTreeToActionItem(menu: MenuTreeVO): ActionItem {
  return {
    name: menu.menuName,
    emit: menu.buttonEvent,
    type: menu.buttonStyle,
    permission: menu.menuPerm,
    icon: menu.menuIcon,
    disabled: false,
    visible: menu.visible === 1
  }
}

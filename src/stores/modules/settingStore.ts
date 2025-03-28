import { MenuWidth } from '@/enums/appEnums'
import { defineStore } from 'pinia'

export const useSettingStore = defineStore('settingStore', {
  state: () => ({
    // 菜单是否折叠
    isCollapse: false,
  }),
  getters: {
    menuWidth: (state) => {
      return state.isCollapse ? MenuWidth.CLOSE : MenuWidth.OPEN
    },
  },
  actions: {
    /** 切换菜单折叠状态*/
    switchFolding() {
      this.isCollapse = !this.isCollapse
    },
  },
  persist: true,
})

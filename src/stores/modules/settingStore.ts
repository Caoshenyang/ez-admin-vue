import { MenuWidthEnum } from '@/enums/appEnums'
import { defineStore } from 'pinia'

export const useSettingStore = defineStore('settingStore', {
  state: () => ({
    // 菜单是否折叠
    isCollapse: false,
    // 是否开启夜间模式
    isNight: false
  }),
  getters: {
    menuWidth: (state) => {
      return state.isCollapse ? MenuWidthEnum.CLOSE : MenuWidthEnum.OPEN
    }
  },
  actions: {
    /** 切换菜单折叠状态*/
    switchFolding() {
      this.isCollapse = !this.isCollapse
    },
    /** 切换夜间模式*/
    switchNight() {
      this.isNight = !this.isNight
    }
  },
  persist: true
})

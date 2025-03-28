import { defineStore } from 'pinia'

export const useSettingStore = defineStore('settingStore', {
  state: () => ({
    // 菜单是否折叠
    isCollapse: false,
  }),
  getters: {},
  actions: {},
  persist: true,
})

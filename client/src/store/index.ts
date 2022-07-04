import { defineStore } from 'pinia'
import { Itab } from './type'

export const mainStore = defineStore('main', {
  state: () => {
    return {
      tabList: new Array<Itab>(),
      contextMenuTabId: ''
    }
  },
  getters: {
    // count10(state) {
    //   console.log('count10 被调用了')
    //   // return state.count + 10
    // },
    getAddTab(state) {
      return state.tabList
    }
  },
  actions: {
    // 添加 tab
    addTab(tab: Itab) {
      const isSome = this.tabList.some((item) => item.path == tab.path)
      if (!isSome) {
        this.tabList.push(tab)
      }
    },
    // 删除 tab
    closeCurrentTab(targetName: string) {
      const index = this.tabList.findIndex((item) => item.path == targetName)
      this.tabList.splice(index, 1)
    },
    // 右键打开菜单保存 path
    saveCurContextTabId(curContextMenuTabId: string) {
      this.contextMenuTabId = curContextMenuTabId
    },
    // 关闭所有 tabs
    closeAllTabs() {
      this.tabList = []
      sessionStorage.removeItem('TABS_ROUTES')
    },
    // 关闭其他 tabs
    closeOtherTabs(par: string) {
      if (par == 'other') {
        this.tabList = this.tabList.filter(
          (item) => item.path == this.contextMenuTabId
        )
      } else if (par == 'left') {
        const index = this.tabList.findIndex(
          (item) => item.path == this.contextMenuTabId
        )
        this.tabList.splice(0, index)
      } else if (par == 'right') {
        const index = this.tabList.findIndex(
          (item) => item.path == this.contextMenuTabId
        )
        this.tabList.splice(index + 1)
      }
    }
  }
})

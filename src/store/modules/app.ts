import { defineStore } from 'pinia'
import { applyTheme, getTheme, saveTheme } from '@/utils/theme'

const SIDEBAR_KEY = 'youngjs_sidebar_collapsed'

interface AppState {
  /** 侧边栏是否折叠 */
  sidebarCollapsed: boolean
  /** 是否暗色主题 */
  isDark: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebarCollapsed: localStorage.getItem(SIDEBAR_KEY) === '1',
    isDark: getTheme(),
  }),

  actions: {
    /** 初始化主题（应用挂载时调用） */
    initTheme() {
      applyTheme(this.isDark)
    },
    /** 切换侧边栏折叠状态 */
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
      localStorage.setItem(SIDEBAR_KEY, this.sidebarCollapsed ? '1' : '0')
    },
    /** 切换暗色主题 */
    toggleTheme() {
      this.isDark = !this.isDark
      saveTheme(this.isDark)
      applyTheme(this.isDark)
    },
  },
})

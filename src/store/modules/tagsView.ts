import { defineStore } from 'pinia'

export interface TagView {
  path: string
  fullPath: string
  name: string
  title: string
  keepAlive?: boolean
  affix?: boolean
}

interface TagsViewState {
  visitedViews: TagView[]
  cachedViews: string[]
}

export const useTagsViewStore = defineStore('tagsView', {
  state: (): TagsViewState => ({
    visitedViews: [],
    cachedViews: [],
  }),

  actions: {
    /** 新增/去重访问标签 */
    addView(view: TagView) {
      if (this.visitedViews.some((v) => v.path === view.path)) return
      this.visitedViews.push(view)
      if (view.name && view.keepAlive && !this.cachedViews.includes(view.name)) {
        this.cachedViews.push(view.name)
      }
    },

    /** 删除单个标签 */
    delView(view: TagView) {
      const index = this.visitedViews.findIndex((v) => v.path === view.path)
      if (index > -1) this.visitedViews.splice(index, 1)
      const cachedIndex = this.cachedViews.indexOf(view.name)
      if (cachedIndex > -1) this.cachedViews.splice(cachedIndex, 1)
    },

    /** 关闭其他标签 */
    delOthersViews(view: TagView) {
      this.visitedViews = this.visitedViews.filter((v) => v.affix || v.path === view.path)
      this.cachedViews = this.visitedViews.filter((v) => v.keepAlive && v.name).map((v) => v.name)
    },

    /** 关闭全部标签 */
    delAllViews() {
      this.visitedViews = []
      this.cachedViews = []
    },
  },
})

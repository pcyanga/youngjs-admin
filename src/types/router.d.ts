import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题 */
    title?: string
    /** 菜单图标名称 */
    icon?: string
    /** 是否在侧边栏/标签页隐藏 */
    hidden?: boolean
    /** 是否需要 keep-alive 缓存 */
    keepAlive?: boolean
    /** 是否固定在标签页 */
    affix?: boolean
  }
}

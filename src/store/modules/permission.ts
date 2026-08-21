import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import type { MenuItem } from '@/types/api'
import { resolveView } from '@/router/views'

interface PermissionState {
  /** 菜单树（后端返回，用于渲染侧边栏） */
  menus: MenuItem[]
  /** 动态生成的路由（布局页 children） */
  routes: RouteRecordRaw[]
  /** 是否已注册动态路由 */
  isRoutesAdded: boolean
  /** 首个可访问菜单路径（登录后默认跳转） */
  firstPath: string
}

/** 深度优先查找第一个 type=2 且配置了 key 的菜单路径（后端 type 为 varchar，需转数字比较） */
function findFirstMenuPath(menus: MenuItem[]): string {
  for (const item of menus) {
    if (Number(item.type) === 2 && item.key) return item.key
    if (item.children?.length) {
      const found = findFirstMenuPath(item.children)
      if (found) return found
    }
  }
  return ''
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    menus: [],
    routes: [],
    isRoutesAdded: false,
    firstPath: '',
  }),

  actions: {
    /**
     * 将后端菜单树转换为路由表（布局页 children）
     * 叶子菜单（type=2 且带 key）生成路由，路由 path/name 使用菜单 key
     */
    generateRoutes(menus: MenuItem[]): RouteRecordRaw[] {
      const routes: RouteRecordRaw[] = []
      this.menus = menus
      this.firstPath = findFirstMenuPath(menus)

      const walk = (list: MenuItem[]) => {
        list.forEach((item) => {
          if (Number(item.type) === 2 && item.key) {
            routes.push({
              path: item.key,
              name: item.key,
              component: resolveView(item.key),
              meta: {
                title: item.name,
                icon: item.icon,
                keepAlive: true,
              },
            })
          }
          if (item.children?.length) walk(item.children)
        })
      }
      walk(menus)

      // 首页重定向到首个可访问菜单
      const redirectPath = this.firstPath || '/user'
      routes.unshift({ path: '/', redirect: redirectPath })

      // 个人中心固定可访问（菜单未配置时兜底）
      if (!routes.some((r) => r.path === '/user')) {
        routes.push({
          path: '/user',
          name: 'Profile',
          component: resolveView('user'),
          meta: { title: '个人中心', icon: 'user', keepAlive: true },
        })
      }
      this.routes = routes
      return routes
    },
  },
})

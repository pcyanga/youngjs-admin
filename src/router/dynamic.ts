import router from './index'
import { usePermissionStore } from '@/store/modules/permission'
import type { MenuItem } from '@/types/api'

/**
 * 根据后端菜单树生成并注册动态路由（布局页 children）
 * 登录成功后与路由守卫首次进入时都会调用
 */
export function setupDynamicRoutes(menus: MenuItem[]): void {
  const permissionStore = usePermissionStore()
  if (permissionStore.isRoutesAdded) return
  const routes = permissionStore.generateRoutes(menus)
  routes.forEach((route) => {
    router.addRoute('Layout', route)
  })
  permissionStore.isRoutesAdded = true
}

import router from './index'
import { WHITE_LIST } from './routes'
import { setupDynamicRoutes } from './dynamic'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'

const DEFAULT_TITLE = 'Youngjs 后台管理系统'

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  // 设置页面标题
  const baseTitle = import.meta.env.VITE_APP_TITLE || DEFAULT_TITLE
  document.title = to.meta.title ? `${to.meta.title} - ${baseTitle}` : baseTitle

  // 未登录：仅放行白名单，其余跳转登录页
  if (!userStore.token) {
    if (WHITE_LIST.includes(to.path)) return true
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  // 已登录访问登录页：回到首页
  if (to.path === '/login') return { path: '/' }

  // 已登录但动态路由尚未生成（首次进入或刷新）：拉取用户信息并注册路由
  if (!usePermissionStore().isRoutesAdded) {
    try {
      const userInfo = await userStore.getUserInfo()
      setupDynamicRoutes(userInfo.menu || [])
      // 重新导航（仅保留 path/query/hash，避免复用旧 matched 导致命中不到新注册的路由）
      return {
        path: to.path,
        query: to.query,
        hash: to.hash,
        replace: true,
      }
    } catch {
      userStore.logout()
      return { path: '/login' }
    }
  }

  return true
})

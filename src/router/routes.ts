import type { RouteRecordRaw } from 'vue-router'

/** 无需登录即可访问的路由 */
export const WHITE_LIST = ['/login', '/403', '/404']

/** 固定路由：登录页 / 错误页 / 布局壳（布局子路由由菜单动态生成） */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true },
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/error/403.vue'),
    meta: { title: '403', hidden: true },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404', hidden: true },
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    children: [],
  },
]

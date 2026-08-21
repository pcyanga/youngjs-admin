/**
 * 菜单 key -> 视图组件映射
 * 后端菜单"路径/key"字段与页面一一对应，这里将 key 指向真实的页面文件。
 * 新增页面时在此登记即可，未登记的 key 兜底渲染 404。
 */
import type { Component } from 'vue'

const viewModules: Record<string, () => Promise<Component>> = {
  // 工作台
  dashboard: () => import('@/views/dashboard/index.vue'),
  // 系统管理
  admin: () => import('@/views/system/user/index.vue'),
  role: () => import('@/views/system/role/index.vue'),
  menu: () => import('@/views/system/menu/index.vue'),
  param: () => import('@/views/system/param/index.vue'),
  task: () => import('@/views/system/task/index.vue'),
  // 个人中心
  user: () => import('@/views/personal/index.vue'),
}

export function resolveView(key: string): () => Promise<Component> {
  return viewModules[key] || (() => import('@/views/error/404.vue'))
}

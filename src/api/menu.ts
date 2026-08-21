import { serverRequest } from '@/utils/request'
import type { MenuItem } from '@/types/api'

/** 菜单列表（树形） */
export function getMenuList() {
  return serverRequest<MenuItem[]>('system/menu/list', {})
}

/** 新增菜单 */
export function addMenu(data: Record<string, unknown>) {
  return serverRequest('system/menu/add', data)
}

/** 修改菜单 */
export function updateMenu(data: Record<string, unknown>) {
  return serverRequest('system/menu/update', data)
}

/** 删除菜单 */
export function deleteMenu(id: number) {
  return serverRequest('system/menu/delete', { id })
}

/** 获取后端全部接口路由（菜单编辑页"接口权限"级联选择用） */
export function getRouters() {
  return serverRequest('system/menu/getRouters', undefined, { method: 'get' })
}

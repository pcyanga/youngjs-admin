import { serverRequest } from '@/utils/request'
import type { PageResult, RoleItem } from '@/types/api'

/** 角色分页列表 */
export function getRolePage(params: Record<string, unknown>) {
  return serverRequest<PageResult<RoleItem>>('system/role/page', params)
}

/** 全部角色（下拉选择用） */
export function getRoleList() {
  return serverRequest<RoleItem[]>('system/role/list', {})
}

/** 角色拥有的菜单 id 集合 */
export function getRoleMenu(roleId: number) {
  return serverRequest<number[]>('system/role/getRoleMenu', { roleId }, { method: 'get' })
}

/** 新增角色（menuIds: 选中的菜单 id 数组） */
export function addRole(data: Record<string, unknown>) {
  return serverRequest('system/role/add', data)
}

/** 修改角色 */
export function updateRole(data: Record<string, unknown>) {
  return serverRequest('system/role/update', data)
}

/** 删除角色 */
export function deleteRole(ids: number | string) {
  return serverRequest('system/role/delete', { ids })
}

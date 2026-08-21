import { serverRequest } from '@/utils/request'
import type { LoginParams, LoginResult, PageResult, UserInfo, UserItem } from '@/types/api'

/** 登录 */
export function login(data: LoginParams) {
  return serverRequest<LoginResult>('system/user/login', data)
}

/** 获取当前用户信息（含菜单权限） */
export function getUserInfo() {
  return serverRequest<UserInfo>('system/user/userInfo', undefined, { method: 'get' })
}

/** 用户分页列表 */
export function getUserPage(params: Record<string, unknown>) {
  return serverRequest<PageResult<UserItem>>('system/user/page', params)
}

/** 用户详情 */
export function getUserById(id: number) {
  return serverRequest<UserItem>('system/user/info', { id }, { method: 'get' })
}

/** 新增用户 */
export function addUser(data: Record<string, unknown>) {
  return serverRequest('system/user/add', data)
}

/** 修改用户 */
export function updateUser(data: Record<string, unknown>) {
  return serverRequest('system/user/update', data)
}

/** 删除用户（支持逗号分隔多个 id） */
export function deleteUser(ids: number | string) {
  return serverRequest('system/user/delete', { ids })
}

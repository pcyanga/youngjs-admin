import { serverRequest } from '@/utils/request'
import type { PageResult, ParamItem } from '@/types/api'

/** 参数配置分页 */
export function getParamPage(params: Record<string, unknown>) {
  return serverRequest<PageResult<ParamItem>>('system/param/page', params)
}

/** 新增参数配置 */
export function addParam(data: Record<string, unknown>) {
  return serverRequest('system/param/add', data)
}

/** 修改参数配置 */
export function updateParam(data: Record<string, unknown>) {
  return serverRequest('system/param/update', data)
}

/** 删除参数配置 */
export function deleteParam(ids: number | string) {
  return serverRequest('system/param/delete', { ids })
}

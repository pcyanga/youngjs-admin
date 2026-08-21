import { serverRequest } from '@/utils/request'
import type { PageResult, TaskItem, TaskLogItem } from '@/types/api'

/** 定时任务分页 */
export function getTaskPage(params: Record<string, unknown>) {
  return serverRequest<PageResult<TaskItem>>('system/task/page', params)
}

/** 新增任务 */
export function addTask(data: Record<string, unknown>) {
  return serverRequest('system/task/add', data)
}

/** 修改任务 */
export function updateTask(data: Record<string, unknown>) {
  return serverRequest('system/task/update', data)
}

/** 删除任务 */
export function deleteTask(ids: number | string) {
  return serverRequest('system/task/delete', { ids })
}

/** 立即执行任务 */
export function runTaskNow(id: number) {
  return serverRequest('system/task/doNow', { id }, { method: 'get' })
}

/** 任务执行日志分页 */
export function getTaskLogPage(params: Record<string, unknown>) {
  return serverRequest<PageResult<TaskLogItem>>('system/task_log/page', params)
}

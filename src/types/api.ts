/**
 * 与 youngjs-last 后端接口交互的类型定义
 * 后端统一返回 { code, message, data }，code === 1000 表示成功
 */

export interface ApiResult<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PageResult<T> {
  list: T[]
  pagination: {
    total: number
    page: number
    size: number
  }
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  expiresIn: number
}

/** 菜单节点（菜单管理中配置，type: 1目录 2菜单 3权限） */
export interface MenuItem {
  id: number
  name: string
  pid: number
  /** 后端列为 varchar，可能返回字符串（如 '2'），使用时用 Number() 转换 */
  type: number | string
  key?: string
  icon?: string
  actions?: string
  sort?: number
  /** 后端菜单列表返回 name as label，便于 el-tree 直接使用 */
  label?: string
  children?: MenuItem[]
}

export interface UserInfo {
  id: number
  username: string
  nickname: string
  status: boolean
  ip?: string
  ipAddr?: string
  roleIds?: number[]
  /** 菜单权限树（后端已按角色过滤） */
  menu?: MenuItem[]
  /** 注意：后端字段名拼写为 aciotnsList（历史遗留），实际为接口权限列表 */
  aciotnsList?: string[]
}

export interface UserItem {
  id: number
  username: string
  nickname: string
  status: boolean
  ip?: string
  ipAddr?: string
  createTime?: string
  updateTime?: string
}

export interface RoleItem {
  id: number
  rolename: string
  createTime?: string
}

export interface ParamItem {
  id: number
  key: string
  value: string
  remark?: string
  createTime?: string
}

export interface TaskItem {
  id: number
  name: string
  type: number
  cron?: string
  every?: number
  limit: number
  service: string
  status: boolean
  nextRunTime?: string
  createTime?: string
}

export interface TaskLogItem {
  id: number
  taskId: number
  result: string
  status: number
  createTime?: string
}

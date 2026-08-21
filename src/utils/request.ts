import axios, { type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { getToken } from './auth'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import type { ApiResult } from '@/types/api'

/**
 * axios 实例
 * youngjs-last 后端统一前缀 /admin，前端通过 vite 代理 /api -> 后端
 */
const service = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截：注入 Token
service.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.authorization = token
  return config
})

// 响应拦截：统一处理业务码与 HTTP 状态
service.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResult
    // 非标准结构（如文件流）直接透传
    if (res === null || typeof res !== 'object' || !('code' in res)) return res
    if (res.code !== 1000) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  (error) => {
    const { response, message } = error
    if (!response) {
      ElMessage.error(message || '网络异常，请稍后重试')
      return Promise.reject(error)
    }
    const { status, data } = response
    const msg = data?.message || message || '请求失败'
    if (status === 403) {
      // Token 失效，清理登录态并回到登录页
      ElMessage.error('登录已失效，请重新登录')
      const userStore = useUserStore()
      userStore.resetState()
      usePermissionStore().$reset()
      router.replace({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
    } else if (status === 401) {
      ElMessage.error(msg)
    } else {
      ElMessage.error(msg)
    }
    return Promise.reject(error)
  }
)

export interface ServerRequestOptions {
  method?: 'get' | 'post'
}

/**
 * 通用请求封装
 * youngjs-last 的 CRUD 约定：info 为 GET，其余（page/add/update/delete/list）为 POST，
 * 自定义接口按其装饰器（@get / @post）为准，因此调用方需显式指定 method
 */
export function serverRequest<T = unknown>(path: string, params?: unknown, options?: ServerRequestOptions): Promise<T> {
  const method = options?.method || 'post'
  const config: AxiosRequestConfig = {
    url: `/admin/${path}`,
    method,
    ...(method === 'get' ? { params } : { data: params }),
  }
  // 响应拦截器已将 AxiosResponse 解包为 ApiResult，此处直接取业务数据 data
  return service.request<ApiResult<T>>(config).then((res) => res.data)
}

import { defineStore } from 'pinia'
import { login as loginApi, getUserInfo as getUserInfoApi } from '@/api/user'
import { getToken, setToken, clearAuth } from '@/utils/auth'
import { usePermissionStore } from './permission'
import type { LoginParams, UserInfo } from '@/types/api'

interface UserState {
  token: string
  userInfo: UserInfo | null
  /** 接口权限列表（后端字段 aciotnsList） */
  actionsList: string[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: getToken(),
    userInfo: null,
    actionsList: [],
  }),

  getters: {
    nickname: (state) => state.userInfo?.nickname || state.userInfo?.username || '管理员',
    username: (state) => state.userInfo?.username || '',
  },

  actions: {
    /** 登录 */
    async login(params: LoginParams) {
      const res = await loginApi(params)
      this.token = res.token
      setToken(res.token)
      return res
    },

    /** 获取当前用户信息（含菜单/权限） */
    async getUserInfo() {
      const res = await getUserInfoApi()
      this.userInfo = res
      this.actionsList = res.aciotnsList || []
      return res
    },

    /** 退出登录 */
    logout() {
      this.resetState()
      usePermissionStore().$reset()
    },

    /** 清空登录态 */
    resetState() {
      this.token = ''
      this.userInfo = null
      this.actionsList = []
      clearAuth()
    },
  },
})

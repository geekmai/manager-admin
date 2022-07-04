import { defineStore } from 'pinia'
import { login } from '@/api/userApi'
import { setToken, removeToken } from '@/utils/token'
import { UserType } from './type'

export const loginStore = defineStore('login', {
  state: () => {
    return {
      token: '',
      userInfo: {} as UserType
    }
  },
  getters: {},
  actions: {
    // 用户登录
    async userLogin(loginForm: object) {
      // 调用登录接口
      const res = await login(loginForm)
      this.userInfo = res.data
      this.token = res.data.token
      // 将 token 保存到本地
      setToken(this.token)
      return res
    },
    // 退出登录
    loginOut() {
      ;(this.token = ''), removeToken()
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user', //自定义 key 值
        storage: sessionStorage //选择存储方式
      }
    ]
  }
})

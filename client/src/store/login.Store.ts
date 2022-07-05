import { defineStore } from 'pinia'
import login from '@/api/userApi'
import { setToken, removeToken } from '@/utils/token'
import storage from '@/utils/storage'
import { UserType } from './type'
import { LoginResInterface } from '@/types/UserTypes'

export const loginStore = defineStore('login', {
  state: () => {
    return {
      token: '',
      userInfo: '' || (storage.getItem('userInfo') as LoginResInterface) //获取用户信息
    }
  },
  getters: {},
  actions: {
    // 储存用户信息
    saveUserInfo(userInfo: LoginResInterface) {
      this.userInfo = userInfo
      storage.setItem('userInfo', userInfo)
    },
    // 用户登录
    // async userLogin(loginForm: object) {
    //   // 调用登录接口
    //   const res = await login(loginForm)
    //   this.userInfo = res.data
    //   this.token = res.data.token
    //   // 将 token 保存到本地
    //   setToken(this.token)
    //   return res
    // },
    // 退出登录
    loginOut() {
      storage.clearAll()
    }
  }
  // persist: {
  //   enabled: true,
  //   strategies: [
  //     {
  //       key: 'user', //自定义 key 值
  //       storage: sessionStorage //选择存储方式
  //     }
  //   ]
  // }
})

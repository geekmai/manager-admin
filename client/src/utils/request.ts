/**
 * axios二次封装
 */
// @ts-nocheck
import axios, { AxiosRequestConfig } from 'axios'
import userConfig from '../userConfig'
import { ElMessage } from 'element-plus'
import router from '../router'
import storage from './storage'
import { ResponseResult } from '@/types/ResponseResult'

const TOKEN_INVALID = 'Token认证失败，请重新登录'
const NETWORK_ERROR = '网络请求异常，请稍后重试'

// 创建axios实例对象，添加全局配置
const service = axios.create({
  baseURL: userConfig.baseApi,
  timeout: 8000
})

// 请求拦截
service.interceptors.request.use((req) => {
  const headers = req.headers
  const { token = '' } = storage.getItem('userInfo') || {}
  if (!headers.Authorization) headers.Authorization = 'Bearer ' + token
  return req
})

// 响应拦截
service.interceptors.response.use((res) => {
  // console.log('res=>', res)
  const { code, data, msg } = res.data
  if (code === 200) {
    return res.data
  } else if (code === 500001) {
    ElMessage.error(TOKEN_INVALID)
    setTimeout(() => {
      router.push('/login')
    }, 1500)
    return Promise.reject(TOKEN_INVALID)
  } else {
    ElMessage.error(msg || NETWORK_ERROR)
    return Promise.reject(msg || NETWORK_ERROR)
  }
})
/**
 * 请求核心函数
 * @param {*} options 请求配置
 */
interface RequestConfig {
  mock?: boolean
}
const request = async <T = any>(config: AxiosRequestConfig): Promise<ResponseResult<T>> => {
  config.method = config.method || 'get'
  if (config.method.toLowerCase() === 'get') {
    config.params = config.data
  }
  let isMock = userConfig.mock
  if (typeof config.mock != 'undefined') {
    isMock = config.mock
  }
  if (userConfig.env === 'prod') {
    service.defaults.baseURL = userConfig.baseApi
  } else {
    service.defaults.baseURL = isMock ? userConfig.mockApi : userConfig.baseApi
  }

  return await service.request<ResponseResult<T>>(config)
}

// function request(options) {
//   options.method = options.method || 'get'
//   if (options.method.toLowerCase() === 'get') {
//     options.params = options.data
//   }
//   let isMock = config.mock
//   if (typeof options.mock != 'undefined') {
//     isMock = options.mock
//   }
//   if (config.env === 'prod') {
//     service.defaults.baseURL = config.baseApi
//   } else {
//     service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
//   }

//   return service(options)
// }

;['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
  request[item] = (url, data, options) => {
    return request({
      url,
      data,
      method: item,
      ...options
    })
  }
})

export default request

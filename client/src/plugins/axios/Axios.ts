/**
 * axios 二次封装
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { getToken } from '@/utils/token'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import router from '@/router'

const TOKEN_INVALID = 'Token 认证失败，请重新登录'
const NETWORK_ERROR = '网络请求异常，请稍后重试'

export default class Axios {
  private instance: AxiosInstance
  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
    this.interceptors() //调用拦截器
  }
  // 请求配置
  public async request<T, D = ResponseResult<T>>(config: AxiosRequestConfig): Promise<D> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.instance.request<D>(config)
        resolve(response.data)
      } catch (error) {
        reject(error)
      }
    })
  }
  // 封装拦截器
  private interceptors() {
    this.interceptorsRequest()
    this.interceptorsResponse()
  }
  // 配置请求拦截器
  private interceptorsRequest() {
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // 在发送请求之前做些什么
        // 在请求头中添加 token
        // const token = localStorage.getItem('token')
        const token = getToken()
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: token
          }
        }
        return config
      },
      (error: any) => {
        // 对请求错误做些什么
        return Promise.reject(error)
      }
    )
  }
  // 配置响应拦截器
  private interceptorsResponse() {
    this.instance.interceptors.response.use(
      // (response) => {
      //   const { code, data, msg } = response.data
      //   if (code === 200) {
      //     return response
      //   } else if (code === 500001) {
      //     ElMessage.error(TOKEN_INVALID)
      //     setTimeout(() => {
      //       router.push('/login')
      //     }, 1500)
      //     return Promise.reject(TOKEN_INVALID)
      //   } else {
      //     ElMessage.error(msg || NETWORK_ERROR)
      //     return Promise.reject(msg || NETWORK_ERROR)
      //   }
      // }
      (response: AxiosResponse) => {
        // 当状态码为 2xx 时,返回 response
        // 也可以返回response.data
        return response
      },
      (error: any) => {
        // 超出 2xx 范围的状态码都会触发该函数。
        // 这里用来处理 http 常见错误，进行全局提示
        const { code, data, msg } = error.response.data
        let message = ''
        switch (code) {
          case 10001:
            message = msg || '参数错误(10001)'
            break
          case 20001:
            message = msg || '账号或密码错误(20001)'
            break
          case 30001:
            message = msg || '用户未登录(30001)'
            break
          case 40001:
            message = msg || '业务请求失败(40001)'
            break
          case 50001:
            message = msg || '认证失败或TOKEN过期(50001)'
            break
          default:
            message = `连接出错(${error.response.status})!`
        }

        // 这里错误消息可以使用全局弹框展示出来
        // 比如element-plus 可以使用 ElMessage
        ElMessage({
          showClose: true,
          message: `${message}，请检查网络或联系管理员！`,
          type: 'error'
        })

        // 这里是AxiosError类型，所以一般我们只reject我们需要的响应即可
        return Promise.reject(error.response)
      }
    )
  }
}

// let message = ''
// switch (error.response.status) {
//   case 400:
//     message = '请求错误(400)'
//     break
//   case 401:
//     message = '未授权，请重新登录(401)'
//     // 这里可以做清空storage并跳转到登录页的操作
//     break
//   case 403:
//     message = '拒绝访问(403)'
//     break
//   case 404:
//     message = '请求出错(404)'
//     break
//   case 408:
//     message = '请求超时(408)'
//     break
//   case 500:
//     message = '服务器错误(500)'
//     break
//   case 501:
//     message = '服务未实现(501)'
//     break
//   case 502:
//     message = '网络错误(502)'
//     break
//   case 503:
//     message = '服务不可用(503)'
//     break
//   case 504:
//     message = '网络超时(504)'
//     break
//   case 505:
//     message = 'HTTP版本不受支持(505)'
//     break
//   default:
//     message = `连接出错(${error.response.status})!`
// }

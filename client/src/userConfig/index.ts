/**
 * 环境配置封装
 */
//@ts-nocheck
const env = import.meta.env.MODE || 'prod'
console.log(import.meta.env.MODE)
// const env = 'dev'
const EnvConfig: object = {
  development: {
    baseApi: '/api',
    mockApi: 'http://127.0.0.1:4523/m1/1219901-0-default/api'
  },
  test: {
    baseApi: 'http://127.0.0.1:8080/',
    mockApi: 'http://127.0.0.1:4523/m1/1219901-0-default/api'
  },
  prod: {
    baseApi: '/',
    mockApi: 'http://127.0.0.1:4523/m1/1219901-0-default/api'
  }
}
export default {
  env,
  mock: true,
  ...EnvConfig[env]
}

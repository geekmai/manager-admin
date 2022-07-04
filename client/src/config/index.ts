/**
 * 环境配置封装
 */
//@ts-nocheck
const env = import.meta.env.MODE || 'prod'
const EnvConfig: object = {
  dev: {
    baseApi: 'http://127.0.0.1:8080/',
    mockApi: 'http://127.0.0.1:4523/m1/1219901-0-default'
  },
  test: {
    baseApi: 'http://127.0.0.1:8080/',
    mockApi: 'http://127.0.0.1:4523/m1/1219901-0-default'
  },
  prod: {
    baseApi: '/',
    mockApi: 'http://127.0.0.1:4523/m1/1219901-0-default'
  }
}
export default {
  env,
  mock: true,
  ...EnvConfig[env]
}

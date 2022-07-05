/**
 * Storage二次封装
 * @author JackBean
 */

import userConfig from '@/userConfig'
export default {
  // 从存储空间中提取已经存储的对象，如果不存在的话，就设置为空对象
  getStorage() {
    return JSON.parse(window.localStorage.getItem(userConfig.namespace) || '{}')
  },
  // 往存储空间中添加属性和值
  setItem(key: string, val: any) {
    let storage = this.getStorage()
    storage[key] = val //key 是一个变量，需要使用[]
    window.localStorage.setItem(userConfig.namespace, JSON.stringify(storage))
  },
  // 提取存储空间中的对象
  getItem(key: string) {
    return this.getStorage()[key]
  },
  // 清空某一项
  clearItem(key: string) {
    let storage = this.getStorage()
    delete storage[key]
    window.localStorage.setItem(userConfig.namespace, JSON.stringify(storage))
  },
  // 清空所有
  clearAll() {
    window.localStorage.clear()
  }
}

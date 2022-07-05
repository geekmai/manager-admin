/**
 * Storage二次封装
 * @author JackBean
 */
// @ts-nocheck
import userConfig from '../userConfig'
export default {
  setItem(key, val) {
    let storage = this.getStorage()
    storage[key] = val
    window.localStorage.setItem(userConfig.namespace, JSON.stringify(storage))
  },
  getItem(key) {
    return this.getStorage()[key]
  },
  getStorage() {
    return JSON.parse(window.localStorage.getItem(userConfig.namespace) || '{}')
  },
  clearItem(key) {
    let storage = this.getStorage()
    delete storage[key]
    window.localStorage.setItem(userConfig.namespace, JSON.stringify(storage))
  },
  clearAll() {
    window.localStorage.clear()
  }
}

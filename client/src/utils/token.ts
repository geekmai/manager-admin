// 封装 localstorage 存取 token
const key = 'nurse-key'

const setToken = (token: string) => {
  return window.localStorage.setItem(key, token)
}
const getToken = () => {
  return window.localStorage.getItem(key)
}
const removeToken = () => {
  return window.localStorage.removeItem(key)
}

export { setToken, getToken, removeToken }

/**
 * 定义用户相关的类型
 */
// 登录之后的返回值
export interface LoginResInterface {
  _id: string
  role: number
  roleList: Array<string>
  token: string
  userName: string
  deptId: Array<string>
}

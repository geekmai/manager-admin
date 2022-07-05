/**
 * api管理
 */
//@ts-nocheck
import request from './../utils/request'

// 注册新用户
export async function userSubmit(params: Object) {
  return await request({
    url: '/users/operate',
    method: 'POST',
    data: params,
    mock: false
  })
}

// 登录
// 定义返回值的类型
interface LoginInterface {
  id: string
  role: string
  success: boolean
  token: string
  username: string
}
export async function login(params: object) {
  return await request<LoginInterface>({
    url: '/users/login',
    method: 'post',
    data: params,
    mock: false
  })
}
// 删除用户
export async function deleteUser(params: Object) {
  return await request({
    url: '/users/delete',
    method: 'POST',
    data: params,
    mock: false
  })
}
// 获取所有用户信息
// 定义数组包对象的类型
interface Page {
  pageNum: number
  pageSize: number
  total: number
}
interface UserInfo {
  list: Array<object>
  page: Page
}
export async function getAllSysUsers(params: Object) {
  return await request<UserInfo>({
    url: '/users/list',
    method: 'POST',
    data: params,
    mock: false
  })
}
// 获取用户角色列表
export async function getRolesList() {
  return await request({
    url: '/roles/allList',
    method: 'GET',
    mock: true
  })
}
// 获取部门列表
export async function getDeptsList() {
  return await request({
    url: '/dept/list',
    method: 'GET'
  })
}
export default {
  noticeCount(params) {
    return request({
      url: '/leave/count',
      method: 'get',
      data: {},
      mock: false
    })
  },
  getMenuList(params) {
    return request({
      url: '/menu/list',
      method: 'get',
      data: params,
      mock: false
    })
  },
  getPermissionList() {
    return request({
      url: '/users/getPermissionList',
      method: 'get',
      data: {},
      mock: false
    })
  },
  // getUserList(params) {
  //   return request({
  //     url: '/users/list',
  //     method: 'get',
  //     data: params
  //   })
  // },
  // getAllUserList() {
  //   return request({
  //     url: '/users/all/list',
  //     method: 'get',
  //     data: {},
  //     mock: false
  //   })
  // },
  // userDel(params) {
  //   return request({
  //     url: '/users/delete',
  //     method: 'post',
  //     data: params
  //   })
  // },
  getRoleAllList() {
    return request({
      url: '/roles/allList',
      method: 'get',
      data: {},
      mock: false
    })
  },
  // getRoleList(params) {
  //   return request({
  //     url: '/roles/list',
  //     method: 'get',
  //     data: params,
  //     mock: false
  //   })
  // },
  // getDeptList(params) {
  //   return request({
  //     url: '/dept/list',
  //     method: 'get',
  //     data: params,
  //     mock: false
  //   })
  // },
  deptOperate(params) {
    return request({
      url: '/dept/operate',
      method: 'post',
      data: params,
      mock: false
    })
  },
  // userSubmit(params) {
  //   return request({
  //     url: '/users/operate',
  //     method: 'post',
  //     data: params,
  //     mock: false
  //   })
  // },
  menuSubmit(params) {
    return request({
      url: '/menu/operate',
      method: 'post',
      data: params,
      mock: false
    })
  },
  roleOperate(params) {
    return request({
      url: '/roles/operate',
      method: 'post',
      data: params,
      mock: false
    })
  },
  updatePermission(params) {
    return request({
      url: '/roles/update/permission',
      method: 'post',
      data: params,
      mock: false
    })
  },
  getApplyList(params) {
    return request({
      url: '/leave/list',
      method: 'get',
      data: params,
      mock: false
    })
  },
  leaveOperate(params) {
    return request({
      url: '/leave/operate',
      method: 'post',
      data: params,
      mock: false
    })
  },
  leaveApprove(params) {
    return request({
      url: '/leave/approve',
      method: 'post',
      data: params,
      mock: false
    })
  }
}

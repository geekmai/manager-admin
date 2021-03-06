const mongoose = require('mongoose')
// 创建 Schema（模式）对象
const userSchema = mongoose.Schema({
  userId: Number, // 用户 ID，自增长
  userName: String, // 用户名称
  userPwd: String, // 用户密码，md5 加密
  userEmail: String, // 用户邮箱
  mobile: String, // 手机号
  sex: Number, // 性别 0:男 1:女
  deptId: [], // 部门
  job: String, // 岗位
  state: {
    type: Number,
    default: 1
  }, // 1: 在职 2:离职 3:试用期
  role: {
    type: Number,
    default: 1
  }, // 用户角色 0:系统管理员 1:普通用户
  roleList: [], // 系统角色
  createTime: {
    type: Date,
    default: Date.now()
  }, //创建时间
  lastLoginTime: {
    type: Date,
    default: Date.now()
  }, //更新时间
  remaik: String
})
// 通过 Schema 创建 Model（模型）对象
// Model 代表的是数据库的集合，通过 Model 才能对数据库进行操作
// mongoose.model(modelName, schema)
module.exports = mongoose.model('users', userSchema, 'users')

const router = require('express').Router()
// 使用 joi 对用户注册和登录时输入的内容进行格式验证
const registerValidation = require('../validation').registerValidation
const editUserValidation = require('../validation').editUserValidation
const loginValidation = require('../validation').loginValidation
// 导入用户数据表
const User = require('../models').userModel
// 导入jsonwebtoken
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

router.use((req, res, next) => {
  console.log('请求到达 user.js')
  next()
})
// 用于测试 API 是否连接畅通
router.get('/testAPI', (req, res) => {
  const msgObj = {
    message: 'TestAPI 测试连接成功！'
  }
  return res.json(msgObj)
})

// 返回用户名和角色
router.get('/', (req, res) => {
  console.log(req.user)
  if (req.user.username) {
    res.send({
      username: req.user.username,
      role: req.user.role
    })
  } else {
    res.send({
      data: null,
      message: '用户的身份信息缺失'
    })
  }
})

// 获取所有用户信息
router.get('/getAllSysUsers', async (req, res) => {
  await User.find({})
    .then((users) => {
      res.status(200).send({
        success: true,
        code: 200,
        message: '获取成功',
        data: users
      })
    })
    .catch(() => {
      res.status(500).send('无法获取用户信息')
    })
})

// 删除用户
/**
 * 只有管理员有权限删除用户
 */
router.delete('/:_id', async (req, res) => {
  // 验证用户是否存在
  let { _id } = req.params
  let user = await User.findOne({ _id })
  if (!user) {
    res.status(404)
    return res.json({
      success: false,
      message: '该用户不存在'
    })
  }
  // 只有管理员有权限删除用户
  if (req.user.isAdmin()) {
    User.deleteOne({ _id })
      .then(() => {
        res.status(200).send({
          success: true,
          code: 200,
          message: '用户删除成功！',
          data: {}
        })
      })
      .catch((e) => {
        res.send({
          success: false,
          message: e
        })
      })
  } else {
    res.status(404)
    return res.json({
      success: false,
      message: '删除失败！只有管理员可以删除用户！'
    })
  }
})

// 更新用户信息
router.patch('/username/:_id', async (req, res) => {
  // 1. 验证用户的输入是否符合格式要求
  const { error } = editUserValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  // 2. 验证用户否存在
  let { _id } = req.params
  let user = await User.findOne({ _id })
  if (!user) {
    res.status(404)
    return res.json({
      success: false,
      message: '该用户不存在'
    })
  }
  // 3. 检查用户名是否已存在
  const usernameExist = await User.findOne({ username: req.body.username })
  if (usernameExist) {
    return res.status(401).send({
      success: false,
      code: 401,
      message: '用户名已存在！',
      data: {}
    })
  }
  // 5. 只有管理员有权限更新用户信息
  if (req.user.isAdmin()) {
    User.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true
    })
      .then(() => {
        res.status(200).send({
          success: true,
          code: 200,
          message: '用户信息更新成功！',
          data: {}
        })
      })
      .catch((e) => {
        res.status(404).send({
          success: false,
          code: 404,
          message: '用户信息更新失败！',
          data: e
        })
      })
  } else {
    res.status(404)
    return res.json({
      success: false,
      message: '更新失败！只有管理员可以修改用户！'
    })
  }
})
// 修改用户密码
router.patch('/password/:_id', async (req, res) => {
  // 1. 验证用户的输入是否符合格式要求
  const { error } = editUserValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  // 2. 验证用户否存在
  let { _id } = req.params
  let user = await User.findOne({ _id })
  if (!user) {
    res.status(404)
    return res.json({
      success: false,
      message: '该用户不存在'
    })
  }
  console.log(req.body)
  // const newPassword = req.body.password
  const hashPassword = await bcrypt.hash(req.body.password, 10)
  const newPassword = {
    password: hashPassword
  }
  console.log(newPassword)
  User.findOneAndUpdate({ _id }, newPassword, {
    new: true,
    runValidators: true
  })
    .then(() => {
      res.status(200).send({
        success: true,
        code: 200,
        message: '密码更新成功！',
        data: {}
      })
    })
    .catch((e) => {
      res.status(404).send({
        success: false,
        code: 404,
        message: '密码更新失败！',
        data: e
      })
    })
})

module.exports = router

const router = require('express').Router()
// 使用 joi 对用户注册和登录时输入的内容进行格式验证
const registerValidation = require('../validation').registerValidation
const loginValidation = require('../validation').loginValidation
// 导入用户数据表
const User = require('../models').userModel
// 导入jsonwebtoken
const jwt = require('jsonwebtoken')

// 中间件设置
router.use((req, res, next) => {
  // console.log('请求到达 auth.js')
  next()
})
// 用于测试 API 是否连接畅通
router.get('/testAPI', (req, res) => {
  const msgObj = {
    message: 'TestAPI 测试连接成功！'
  }
  return res.json(msgObj)
})
// 用户注册账号
router.post('/register', async (req, res) => {
  // 1. 对用户输入的信息进行格式验证，如果格式不对就返回 error
  const { error } = registerValidation(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }
  // 如果格式没有问题，就继续
  // 2. 检查用户名是否已存在
  const usernameExist = await User.findOne({ username: req.body.username })
  if (usernameExist) {
    return res.status(400).send('用户名已存在！')
  }
  // 3.创建新用户实例
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
    role: req.body.role

    // email: req.body.email,
  })
  // 4. 将新用户存储到数据库
  try {
    const savedUser = await newUser.save()
    res.status(200).send({
      success: true,
      code: 200,
      message: '注册成功',
      data: {}
    })
  } catch (err) {
    res.status(400).send('注册失败')
  }
})
// 用户注册账号

// 用户登录验证
router.post('/login', (req, res) => {
  // 1. 使用 loginValidation 对用户输入的信息进行格式校验
  const { error } = loginValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  // 2. 如果没有错误的话，就去数据表中搜索用户传过来的用户名
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) {
      res.status(400).send(err)
    }
    if (!user) {
      res.status(401).send('用户名不存在')
    } else {
      // 如果用户信息存在，将用户输入的密码与数据库中的密码进行比较
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) return res.status(400).send(err)
        // 如果密码相同，isMatch 的值为 true
        if (isMatch) {
          // 使用用户 id 和用户名来制作 token
          const tokenObject = { _id: user._id, username: user.username }
          // PASSPORT_SECRET 在.env 中设置
          const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET)
          res.status(200).send({
            success: true,
            code: 200,
            message: '成功',
            data: {
              id: user._id,
              username: user.username,
              role: user.role,
              status: user.status,
              token: 'JWT ' + token
            }
          })
        } else {
          res.status(401).send('密码错误！')
        }
      })
    }
  })
})
// 用户登录验证

module.exports = router

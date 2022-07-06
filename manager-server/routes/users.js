/**
 * 用户管理模块
 */
const router = require('koa-router')()
const User = require('./../models/userSchema')
const util = require('./../utils/util')
const Counter = require('./../models/counterSchema')
const md5 = require('md5')
// 引入 jsonwebtoken
const jwt = require('jsonwebtoken')
// 定义二级路由
router.prefix('/users')

// 登录接口
router.post('/login', async (ctx) => {
  try {
    const { userName, userPwd } = ctx.request.body
    /**
     * 返回数据库指定字段，有三种方式
     * 1. 字符串，'userId userName userEmail state role deptId roleList'
     * 2. JSON 格式：{userId:1,_id:0},1 代表返回，0 代表不返回
     * 3. select('userId')
     */
    const res = await User.findOne(
      {
        userName,
        userPwd
      },
      'userId userName userEmail state role deptId roleList'
    ) //指定返回哪些字段(mongoose 语法)，中间使用空格隔开
    if (res) {
      // 拿到用户信息
      const userData = res._doc
      // 使用用户信息来制作 token，过期时间为 1 天，密钥为 xiaomaimai
      const token = jwt.sign(userData, 'xiaomaimai', { expiresIn: '1d' })
      // 将 token 添加到用户信息上
      userData.token = token
      // 返回用户信息
      ctx.body = util.success(userData)
    } else {
      ctx.status = 400
      ctx.body = util.fail('账号或密码不正确')
    }
  } catch (error) {
    ctx.status = 400
    ctx.body = util.fail(error.msg)
  }
})

// 用户列表
router.post('/list', async (ctx) => {
  const { userId, userName, state } = ctx.request.body
  // console.log(userId)
  const { page, skipIndex } = util.pager(ctx.request.body)
  // console.log(skipIndex)
  let params = {}
  // 判断查询字段是否存在，存在的话就赋值
  if (userId) params.userId = userId
  if (userName) params.userName = userName
  if (state && state != 0) params.state = state
  console.log(params)
  try {
    // 根据条件查询所有用户列表
    const query = User.find(params, { _id: 0, userPwd: 0 })
    // console.log(query)
    // 分页查询，从 skipIndex 开始查询，查询 page.pageSize 条数据
    const list = await query.skip(skipIndex).limit(page.pageSize)
    // 查询一共有多少条数据
    const total = await User.countDocuments(params)
    ctx.body = util.success({
      page: {
        ...page,
        total
      },
      list
    })
  } catch (error) {
    ctx.body = util.fail(`查询异常：${error.stack}`)
  }
})

// 用户删除 / 批量删除
router.post('/delete', async (ctx) => {
  // 待删除的用户 Id 数组
  const { userIds } = ctx.request.body
  // 这里使用的是 in 方法，指定 userId 字段，查询包含在 userIds 中的，然后将状态更改为 2
  const res = await User.updateMany({ userId: { $in: userIds } }, { state: 2 })
  if (res.nModified) {
    ctx.body = util.success(res, `共成功删除${res.nModified}条数据`)
    return
  } else {
    ctx.status = 400
    ctx.body = util.fail('删除失败')
  }
})

// 用户新增 / 编辑
router.post('/operate', async (ctx) => {
  // 解构数据
  const { userId, userName, userEmail, mobile, job, state, roleList, deptId, action } = ctx.request.body
  // 如果是新增模式
  if (action == 'add') {
    // 这三个字段不能为空
    // if (!userName || !userEmail || !deptId) {
    //   ctx.body = util.fail('参数错误', util.CODE.PARAM_ERROR)
    //   return
    // }

    // console.log('doc=>:', doc)
    const res = await User.findOne({ $or: [{ userName }, { userEmail }] }, '_id userName userEmail')
    if (res) {
      ctx.status = util.CODE.BAD_REQUEST
      ctx.body = util.fail(`系统监测到有重复的用户，信息如下：${res.userName} - ${res.userEmail}`)
      // console.log(ctx)
    } else {
      /**
       * 这里通过单独维护 Counter 这张表来实现用户 ID 自增加 1
       * 在 Counter 中查找 _id: 'userId'，找到之后把 sequence_value 的值加 1，然后返回更新后的表
       */
      const doc = await Counter.findOneAndUpdate({ _id: 'userId' }, { $inc: { sequence_value: 1 } }, { new: true })
      try {
        const user = new User({
          userId: doc.sequence_value,
          userName,
          userEmail,
          role: 1,
          roleList,
          job,
          state,
          deptId,
          mobile,
          userPwd: md5('123456')
        })
        user.save()
        ctx.body = util.success({}, '用户创建成功')
      } catch (error) {
        ctx.body = util.fail(error.stack, '用户创建失败')
      }
    }
  } else {
    if (!deptId) {
      // 如果是编辑模式，部门不能为空
      ctx.body = util.fail('部门不能为空', util.CODE.PARAM_ERROR)
      return
    }
    // 根据用户 id 进行更新里面的状态
    try {
      const res = await User.findOneAndUpdate({ userId }, { mobile, job, state, roleList, deptId })
      ctx.body = util.success({}, '更新成功')
      return
    } catch (error) {
      ctx.body = util.fail(error.stack, '更新失败')
    }
  }
})
module.exports = router

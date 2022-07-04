const router = require('express').Router()
// 导入 Course 数据表
const Course = require('../models').courseModel
// 导入课程录入的格式验证模块
const courseValidation = require('../validation').courseValidation

// 中间件设置
router.use((req, res, next) => {
  console.log('请求到达 Course API')
  next()
})
// 获取所有课程
router.get('/', (req, res) => {
  Course.find({})
    // 当我们找到课程之后，把和这个课程相关联的老师的信息也一起抛出来
    .populate('teacher', ['username', 'role'])
    .then((course) => {
      res.send(course)
    })
    .catch(() => {
      res.status(500).send('无法获取课程资源')
    })
})
// 根据 id 获取课程
router.get('/:_id', (req, res) => {
  let { _id } = req.params
  Course.findOne({ _id })
    .populate('teacher', ['username'])
    .then((course) => {
      res.send(course)
    })
    .catch((e) => {
      res.send(e)
    })
})
// 添加课程
router.post('/', async (req, res) => {
  // 1. 验证用户输入的课程内容的格式是否正确
  const { error } = courseValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  // 2. 从 req.body 中提取课程名称、描述和价格
  let { title, description, price } = req.body
  // 3. 校验用户是否为学生，isStudent()是在 user-model.js 中设置的函数
  if (req.user.isStudent()) {
    return res.status(400).send('学生无法添加课程')
  }

  let newCourse = new Course({
    title,
    description,
    price,
    teacher: req.user._id
  })

  try {
    await newCourse.save()
    res.status(200).send('课程添加成功')
  } catch (err) {
    res.status(400).send('课程添加失败')
  }
})

// 更新课程
router.patch('/:_id', async (req, res) => {
  // 验证用户的输入是否符合格式要求
  const { error } = courseValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  // 验证课程是否存在
  let { _id } = req.params
  let course = await Course.findOne({ _id })
  if (!course) {
    res.status(404)
    return res.json({
      success: false,
      message: '没有找到课程'
    })
  }
  // 只有课程作者和管理员有权限更新课程
  // 课程的 teacher 字段是和 User 表进行关联的，它的值其实是 User 的 _id(是mongoDB 生成的那个_id)
  // 如果这个 _id 和发起请求的用户的 _id 相同的话，就说明这门课程是这位老师的
  // 或者发起请求的是管理员的话，也有权限进行更改
  if (course.teacher.equals(req.user._id) || req.user.isAdmin()) {
    Course.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true
    })
      .then(() => {
        res.send('课程更新成功！')
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
      message: '更新失败！只有课程作者和管理员可以修改课程！'
    })
  }
})

// 删除课程
router.delete('/:_id', async (req, res) => {
  // 验证课程是否存在
  let { _id } = req.params
  let course = await Course.findOne({ _id })
  if (!course) {
    res.status(404)
    return res.json({
      success: false,
      message: '没有找到课程'
    })
  }
  // 只有课程作者和管理员有权限删除课程
  if (course.teacher.equals(req.user._id) || req.user.isAdmin()) {
    Course.deleteOne({ _id })
      .then(() => {
        res.send('课程删除成功！')
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
      message: '删除失败！只有课程作者和管理员可以删除课程！'
    })
  }
})

module.exports = router

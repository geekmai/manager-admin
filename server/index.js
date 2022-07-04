const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
// 导入路由模块
const authRoute = require('./routes').auth
const courseRoute = require('./routes').course
const userRoute = require('./routes').user
const articlesRoute = require('./routes').articles
// 这里导入的是 passport 这个模块
const passport = require('passport')
// 导入并使用我们在 passport.js 中导出的函数，前半部分是个函数，passport 是参数，这里是直接执行这个函数
require('./config/passport')(passport)
// 解决跨域问题
const cors = require('cors')

// 连接到 MongoDB
mongoose
  .connect(process.env.DB_CONNECT, {
    //将数据库地址保存到了.env 文件中
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('已连接到MongDB')
  })
  .catch((e) => {
    console.log(e)
  })
// 中间件
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// 要在路由之前使用cors
app.use(cors())
app.use('/api/user', authRoute)
app.use(
  '/api/user/profile',
  passport.authenticate('jwt', { session: false }),
  userRoute
)
app.use(
  '/api/course',
  // 使用 passport 保护 /api/course 路由
  passport.authenticate('jwt', { session: false }),
  courseRoute
)
app.use(
  '/api/articles',
  passport.authenticate('jwt', { session: false }),
  articlesRoute
)

// 端口设置
app.listen(8080, () => {
  console.log('Server ruuning on port 8080.')
})

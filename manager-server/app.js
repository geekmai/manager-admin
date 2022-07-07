const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const users = require('./routes/users')
const log4js = require('./utils/log4j')
const router = require('koa-router')()
const koajwt = require('koa-jwt')
const util = require('./utils/util')
const cors = require('koa2-cors')

// error handler
onerror(app)

require('./config/db')

// middlewares 中间件
app.use(cors())
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
)
app.use(json())
// app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(
  views(__dirname + '/views', {
    extension: 'pug'
  })
)

// logger 日志
app.use(async (ctx, next) => {
  log4js.info(`get params:${JSON.stringify(ctx.request.query)}`)
  log4js.info(`post params:${JSON.stringify(ctx.request.body)}`)
  await next().catch((err) => {
    if (err.status == '401') {
      ctx.status = 200
      ctx.body = util.fail('Token 认证失败', util.CODE.AUTH_ERROR)
    } else {
      throw err
    }
  })
})

// token 有效性验证的中间件
// 使用 unless 方法可以排除不需要校验的路由
app.use(
  koajwt({ secret: 'xiaomaimai' }).unless({
    path: ['/api/users/login']
  })
)
// 定义路由
// 一级路由
router.prefix('/api')
// 挂载 users 二级路由
router.use(users.routes(), users.allowedMethods())
// app 全局挂载路由
app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  // console.error('server error', err, ctx)
  log4js.error(`${err.stack}`)
})

module.exports = app

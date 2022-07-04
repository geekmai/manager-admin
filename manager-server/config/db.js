/**
 * 数据库连接
 */
// 引入数据库配置文件
const config = require('./index')
// 引入 mongoose
const mongoose = require('mongoose')
const log4js = require('./../utils/log4j')

// 连接 mongodb 数据库
mongoose.connect(config.URL, { useNewUrlParser: true, useUnifiedTopology: true })

// 监听 mongodb 数据库的连接状态
const db = mongoose.connection
// 绑定数据库连接成功事件
db.on('open', () => {
  log4js.info('***数据库连接成功***')
})

// 绑定数据库连接失败事件
db.on('error', () => {
  log4js.error('***数据库连接失败***')
})

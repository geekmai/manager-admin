/**
 * 维护用户 ID 自增长
 */
const mongoose = require('mongoose')
// 创建 Schema（模式）对象
const counterSchema = mongoose.Schema({
  _id: String,
  sequence_value: Number
})

module.exports = mongoose.model('counter', counterSchema, 'counters')

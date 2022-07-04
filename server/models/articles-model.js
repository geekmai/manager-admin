const mongoose = require('mongoose')
const { v4: uuid } = require('uuid')

const articlesSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuid
  },
  pubdate: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  content: {
    type: String,
    default: '请添加内容'
  }
})
const Articles = mongoose.model('Articles', articlesSchema)
module.exports = Articles

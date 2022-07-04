const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  id: { type: String },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    // 这里将课程中的 teacher 字段和 User 这个数据表进行了绑定
    // 当我们搜索课程的时候，可以使用 populate 把 User 中的信息也一起抛出来
  },
  students: {
    type: [String],
    default: []
  }
})

const Course = mongoose.model('Course', courseSchema)
module.exports = Course

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024
  },
  role: {
    type: String,
    enum: ['teacher', 'student', 'admin', 'super-admin'],
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})
userSchema.methods.isStudent = function () {
  return this.role == 'student'
}
userSchema.methods.isTeacher = function () {
  return this.role == 'teacher'
}
userSchema.methods.isAdmin = function () {
  return this.role == 'admin'
}

// mongoose schema middleare 中间件
// 对用户输入的密码进行加密
// 在保存之前要先对密码进行检查和hash加密
userSchema.pre('save', async function (next) {
  // 如果密码被修改过，或者密码是新的，这里的 this 指的是传入的密码
  if (this.isModified('password') || this.isNew) {
    // 使用 bcrypt 对传入的密码进行加密
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
  } else {
    next()
  }
})

// 将用户传入的密码与数据库中经过 hash 加密过的密码进行比较
// 第一个 password 是用户登录时输入的，this.password 是数据库中经过 hash 加密的密码
userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err, isMatch) //cb 指回调函数，此时 isMatch 是 false
    }
    cb(null, isMatch) //此时 isMatch 是 true
  })
}

module.exports = mongoose.model('User', userSchema)

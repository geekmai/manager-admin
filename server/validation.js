// 使用 joi 对用户输入的内容进行格式校验
const Joi = require('joi')

// 用户注册格式验证
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).max(255).required(),
    // email: Joi.string().min(6).max(50).required().email(),
    role: Joi.string().required().valid('student', 'teacher', 'admin')
  })
  return schema.validate(data)
}
// 用户信息更新验证
const editUserValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50),
    password: Joi.string().min(6).max(255),
    role: Joi.string().valid('student', 'teacher', 'admin'),
    status: Joi.boolean()
  })
  return schema.validate(data)
}
// 用户登录格式验证
const loginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).max(255).required()
  })
  return schema.validate(data)
}
// 添加课程格式验证
const courseValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(6).max(50).required(),
    description: Joi.string().min(6).max(50).required(),
    price: Joi.number().min(10).max(9999).required()
  })
  return schema.validate(data)
}
module.exports.registerValidation = registerValidation
module.exports.editUserValidation = editUserValidation
module.exports.loginValidation = loginValidation
module.exports.courseValidation = courseValidation

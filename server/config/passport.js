// 使用 passport-jwt 对 token 进行验证
// 如果任何路由中有 passport.authenticate('JWT') 这个中间件的话，下面的代码就会被执行
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models').userModel

module.exports = (passport) => {
  let opts = {}
  // 从请求头 AuthHeader 搜索含有 jwt 的 token
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
  // 设置进行解密所需要的密码
  opts.secretOrKey = process.env.PASSPORT_SECRET
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      // 通过 _id 去搜索用户是否存在
      User.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) {
          return done(err, false)
        }
        if (user) {
          done(null, user)
        } else {
          done(null, false)
        }
      })
    })
  )
}

const { initialize } = require('passport')
const passport = require('passport')
const User = require('../models/user')
const LocalStrategy = require('passport-local').Strategy

module.exports = app => {
  //初始化passport
  app.use(passport.initialize())
  app.use(passport.session())

  //設定本地策略
  passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    User.findOne({email})
    .then(user => {
      //如果找不到，代表沒註冊過
      if (!user) {
        return done(null, false, { message: 'That email is not registered!' })
      }
      //密碼錯誤
      if (user.password !== password) {
        return done(null, false, { message: 'Password incorrect!' })
      }
      return done(null, user)
    })
    .catch(err => done(err, false)) 
  }))
  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}
const { initialize } = require('passport')
const passport = require('passport')
const User = require('../models/user')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')

module.exports = app => {
  //初始化passport
  app.use(passport.initialize())
  app.use(passport.session())

  //設定本地策略
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true}, (req, email, password, done) => {
    User.findOne({email})
    .then(user => {
      //如果找不到，代表沒註冊過
      if (!user) {
        //有看其他同學是把req.flash放在done function 中，不知為何可以?
        req.flash('loginError', 'That email is not registered!')
        return done(null, false, { message: 'That email is not registered!' })
      }
      //密碼錯誤
      return bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) {
          req.flash('loginError', 'Email or Password incorrect!')
          return done(null, false, { message: 'Email or Password incorrect!' })
        }
        return done(null, user)
      })
    })
    .catch(err => done(err, false)) 
  }))

  //Facebook Strategy
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
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
const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  //取得註冊參數
  const {name, email, password, confirmPassword} = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({message: '所有欄位皆為必填!'})
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！'})
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name, 
      email, 
      password, 
      confirmPassword
    })
  }
  //檢查是否有註冊
  User.findOne({email})
  .then(user => {
    //如果有，退回註冊畫面
    if (user) {
      errors.push({ message: 'this email is already registered' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    //如果沒有，寫入資料庫
    else {
      return User.create({
        name,
        email,
        password
      })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    }
  })
  .catch(err => console.log(err))
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})


module.exports = router
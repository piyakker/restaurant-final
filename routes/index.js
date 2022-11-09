const express = require('express')
const router = express.Router()

//載入分支路由
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
const { authenticator } = require('../middleware/auth')

router.use('/restaurants', authenticator, restaurants)
router.use('/users', users)
router.use('/', authenticator, home)

//匯出總路由
module.exports = router
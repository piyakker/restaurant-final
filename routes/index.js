const express = require('express')
const router = express.Router()

//載入分支路由
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')

router.use('/', home)
router.use('/restaurants', restaurants)
router.use('/users', users)

//匯出總路由
module.exports = router
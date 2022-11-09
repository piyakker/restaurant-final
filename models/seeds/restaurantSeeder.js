const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant = require('../restaurant') // 載入 restaurant model
const User = require('../user')
const restaurantList = require('../../restaurant.json').results

const db = require('../../config/mongoose')

const SEED_USER1 = {
  email: 'user1@example.com',
  password: '12345678'
}
const SEED_USER2 = {
  email: 'user2@example.com',
  password: '12345678'
}

db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER1.password, salt))
    .then(hash => User.create({
      email: SEED_USER1.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      return Promise.all(Array.from(
        { length: 3 },
        (_, i) => Restaurant.create({...restaurantList[i], userId})
      ))
    })
    .then(() => {
      console.log('seedUser1 done.')
    })
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER2.password, salt))
    .then(hash => User.create({
      email: SEED_USER2.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      return Promise.all(Array.from(
        { length: 3 },
        (_, i) => Restaurant.create({...restaurantList[i + 3], userId})
      ))
    })
    .then(() => {
      console.log('seedUser2 done.')
      process.exit()
    })
})
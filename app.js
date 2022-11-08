const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const usePassport = require('./config/passport')

const routes = require('./routes')
require('./config/mongoose')

const app = express()
const port = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'SecretKey',
  resave: true,
  saveUninitialized: false
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

usePassport(app)

app.use(routes)

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})
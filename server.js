require('dotenv').config()
const path = require('path')
const express = require('express')
const router = express.Router()
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
require('./scripts/passport')(passport)
const clientRouter = require('./routers/clientRoutes')
const indexRouter = require('./routers/indexRoutes')
const authRouter = require('./routers/authenticate')
const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(
  '/script-adminlte',
  express.static(path.join(__dirname, '/node_modules/admin-lte/'))
)

app.set('view engine', 'ejs')
const mongo_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
app.use(methodOverride('_method'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    name: 'user_session',
    resave: false,
    saveUninitialized: false,
    cookie: { path: '/', secure: false, maxAge: 3600000 }, // 3600000ms = 3600s = 60mins, cookie expires in an hour
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(passport.initialize())
app.use(passport.session())
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

app.use('/', indexRouter)
app.use('/authenticate', authRouter)
app.use('/clients', clientRouter)

mongoose
  .connect(mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((response) => {
    // Database connected successfully
    console.log('Database connection successful')

    // app.use('/clients', clientRouter)
    // app.get('/clients', function (req, res) {
    //   res.render('clients/index')
    // })

    // app.get('/dashboard', function (req, res) {
    //   res.render('dashboard')
    // })

    app.listen(3000, function () {
      console.log('connected')
    })
  })

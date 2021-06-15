require('dotenv').config()
const path = require('path')
const express = require('express')
const router = express.Router()
const methodOverride = require('method-override')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
require('./passport.js')(passport)

const session = require('express-session')
const clientRouter = require('./routers/clientRoutes')
const indexRouter = require('./routers/indexRoutes')
const User = require('./models/users')
const app = express()
const GoogleStrategy = require('passport-google-oauth20').Strategy

app.use(cors())
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
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET',
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(passport.initialize())
app.use(passport.session())
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

app.use('/', indexRouter)
app.use('/clients', clientRouter)

mongoose
  .connect(mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((response) => {
    // Database connected successfully
    console.log('Database connection successful')

    app.listen(3000, function () {
      console.log('connected')
    })
  })

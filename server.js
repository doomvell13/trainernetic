require('dotenv').config()
const path = require('path')
const express = require('express')
const router = express.Router()
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const clientRouter = require('./routers/clientRoutes')
const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(
  '/script-adminlte',
  express.static(path.join(__dirname, '/node_modules/admin-lte/'))
)

app.set('view engine', 'ejs')
const mongo_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
app.use(methodOverride('_method'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

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

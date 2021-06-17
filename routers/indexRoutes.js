const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const moment = require('moment')
const saltRounds = 10

const {
  authenticatedOnly,
  guestOnly,
} = require('../middlewares/auth-middleware')

const UserModel = require('../models/users')
const { ClientModel } = require('../models/clients')

router.get('/', guestOnly, (req, res) => {
  res.render('login')
})

router.get('/register', guestOnly, (req, res) => {
  res.render('register')
})

router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

router.post(
  '/register',
  passport.authenticate(['local', 'google']),
  (req, res) => {
    const { name, email, password, password2 } = req.body
    let errors = []

    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' })
    }

    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' })
    }

    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' })
    }

    if (errors.length > 0) {
      res.render('register', {
        errors,
        name,
        email,
        password,
        password2,
      })
    } else {
      UserModel.findOne({ 'local.email': email }).then((user) => {
        if (user) {
          errors.push({ msg: 'Email already exists' })
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2,
          })
        } else {
          const newUser = new UserModel({
            name,
            email,
            password,
          })

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash('newUser.password', salt, (err, hash) => {
              if (err) throw err
              newUser.password = hash
              newUser
                .save()
                .then((user) => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  )
                  res.redirect('/login')
                })
                .catch((err) => console.log(err))
            })
          })
        }
      })
    }
  }
)

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next)
})

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function (req, res) {
    // Successful authentication, redirect success.
    res.redirect('/dashboard')
  }
)

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You are logged out')
  res.redirect('/')
})

router.get('/dashboard', authenticatedOnly, async (req, res) => {
  try {
    const users = await UserModel.find({ user: req.user.id })
    const clients = await ClientModel.find()
    res.render('dashboard', {
      name: req.user.displayName,
      clients: clients,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router

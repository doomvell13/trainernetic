const express = require('express')
const router = express.Router()
const passport = require('passport')

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

router.get(
  '/google/callback',
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
    res.render('dashboard', {
      name: req.user.firstName,
      users,
    })
  } catch (err) {
    console.error(err)
  }
})

module.exports = router

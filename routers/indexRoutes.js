const express = require('express')
const router = express.Router()
const passport = require('passport')

const {
  authenticatedOnly,
  guestOnly,
} = require('../middlewares/auth-middleware')

const UserModel = require('../models/users')

router.get('/', guestOnly, (req, res) => {
  res.render('login')
})

router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function (req, res) {
    // Successful authentication, redirect success.
    res.redirect('/dashboard')
  }
)

router.get('/logout', (req, res) => {
  req.session = null
  req.logout()
  res.redirect('/')
})

router.get('/dashboard', authenticatedOnly, async (req, res) => {
  try {
    const users = await UserModel.find({ user: req.user.id }).lean()
    res.render('dashboard', {
      name: req.user.firstName,
      users,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router

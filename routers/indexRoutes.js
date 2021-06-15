const express = require('express')
const router = express.Router()
const {
  authenticatedOnly,
  guestOnly,
} = require('../middlewares/auth-middleware')

const ClientModel = require('../models/clients')

router.get('/', guestOnly, (req, res) => {
  res.render('login')
})

router.get('/dashboard', authenticatedOnly, async (req, res) => {
  try {
    const clients = await ClientModel.find({ user: req.user.id }).lean()
    res.render('dashboard', {
      name: req.user.first_name,
      clients,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router

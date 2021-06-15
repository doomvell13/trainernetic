const express = require('express')
const router = express.Router()
const { auth } = require('express-openid-connect')

router.get('/', clientController.index)

module.exports = router

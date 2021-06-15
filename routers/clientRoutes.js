const express = require('express')
const router = express.Router()
const clientController = require('../controllers/clientController')
const { auth, requiresAuth } = require('express-openid-connect')

router.get('/', requiresAuth(), clientController.index)

// // new (display form)
router.get('/newclient', requiresAuth(), clientController.newClientForm)

// // show
router.get('/:slug', requiresAuth(), clientController.getClient)

// create route
router.post('/', requiresAuth(), clientController.newClient)

// update
router.get('/:slug/editclient', requiresAuth(), clientController.editClient)

// update
router.patch('/:slug', requiresAuth(), clientController.update)

// delete
router.delete('/:slug', requiresAuth(), clientController.delete)

module.exports = router

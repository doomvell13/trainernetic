const express = require('express')
const router = express.Router()
const clientController = require('../controllers/clientController')
const { authenticatedOnly } = require('../middlewares/auth-middleware')

router.get('/', clientController.index)

// // new (display form)
router.get('/newclient', authenticatedOnly, clientController.newClientForm)

// // show
router.get('/:slug', authenticatedOnly, clientController.getClient)

// create route
router.post('/', authenticatedOnly, clientController.newClient)

// update
router.get('/:slug/editclient', authenticatedOnly, clientController.editClient)

// update
router.patch('/:slug', authenticatedOnly, clientController.update)

// delete
router.delete('/:slug', authenticatedOnly, clientController.delete)

module.exports = router

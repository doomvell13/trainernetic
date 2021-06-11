const express = require('express')
const router = express.Router()
const clientController = require('../controllers/clientController')

router.get('/', clientController.index)

// // new (display form)
router.get('/newclient', clientController.newClientForm)

// // show
router.get('/:slug', clientController.getClient)

// create route
router.post('/', clientController.newClient)

// update
router.get('/:slug/editclient', clientController.editClient)

// update
router.patch('/:slug', clientController.update)

// delete
router.delete('/:slug', clientController.delete)

module.exports = router

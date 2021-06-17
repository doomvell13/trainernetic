const _ = require('lodash')
const moment = require('moment')
const { ClientModel } = require('../models/clients')

module.exports = {
  index: async (req, res) => {
    let clients = []

    try {
      clients = await ClientModel.find()
    } catch (err) {
      res.statusCode(500)
      console.log(err)
    }
    res.render('clients/index', {
      clients: clients,
    })
  },

  newClientForm: (req, res) => {
    res.render('clients/newclient')
  },

  getClient: (req, res, next) => {
    let slug = req.params.slug
    ClientModel.findOne({ slug: req.params.slug })

      .then((clients) => {
        res.render('clients/showclient', {
          helper: require('../helpers/helper'),
          clients: clients,
          pageTitle: 'Client Profile',
          path: '/clients',
        })
      })
      .catch((err) => {
        console.log(err)
      })
  },

  newClient: (req, res) => {
    let firstname = req.body.first_name.toLowerCase()
    let lastname = req.body.last_name.toLowerCase()
    let clientname = _.concat(firstname, lastname)
    const slug = _.kebabCase(clientname)
    const formatDOB = moment(req.body.dateofbirth).format('DD-MM-YYYY')

    ClientModel.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      gender: req.body.gender,
      contact: req.body.contact,
      dateofbirth: formatDOB,
      address: req.body.address,
      email: req.body.email,
      nextofkin: req.body.nextofkin,
      nokcontact: req.body.nokcontact,
      slug: slug,
      status: req.body.status,
      userid: req.user,
    })
      .then((createClient) => {
        req.flash('success_msg', 'Success! Client profile is created.')
        res.redirect('/clients/' + slug)
      })
      .catch((err) => {
        console.log(err)
        res.redirect('/clients/newclient')
      })
  },

  editClient: (req, res) => {
    ClientModel.findOne({ slug: req.params.slug })
      .then((response) => {
        res.render('clients/editclient', {
          clients: response,
        })
      })
      .catch((err) => {
        console.log(err)
        res.send('db error')
      })
  },

  update: (req, res) => {
    let firstname = req.body.first_name.toLowerCase()
    let lastname = req.body.last_name.toLowerCase()
    let clientname = _.concat(firstname, lastname)
    let newSlug = _.kebabCase(clientname)

    ClientModel.updateOne(
      { slug: req.params.slug },
      {
        $set: {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          gender: req.body.gender,
          contact: req.body.contact,
          dateofbirth: req.body.dateofbirth,
          address: req.body.address,
          email: req.body.email,
          nextofkin: req.body.nextofkin,
          nokcontact: req.body.nokcontact,
          slug: newSlug,
          status: req.body.status,
        },
      }
    )
      .then((response) => {
        req.flash('success_msg', 'Client profile successfully updated.')
        res.redirect('/clients/' + newSlug)
      })
      .catch((err) => {
        console.log(err)
        res.redirect('/clients/' + req.params.slug)
      })
  },

  delete: (req, res) => {
    ClientModel.deleteOne({
      slug: req.params.slug,
    })
      .then((deleteClient) => {
        req.flash('success_msg', 'Client profile is deleted.')
        res.redirect('/clients')
      })
      .catch((err) => {
        console.log(err)
        res.redirect('/clients')
      })
  },
}

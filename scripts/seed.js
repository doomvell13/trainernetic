require('dotenv').config()
const mongoose = require('mongoose')
const _ = require('lodash')
const clientsData = require('../models/clientsdata')
const {ClientModel} = require('../models/clients')

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

clientData = clientsData.map(item => {
  let firstname = item.first_name.toLowerCase()
  let lastname = item.last_name.toLowerCase()
  let clientname = _.concat(firstname, lastname)
  item.slug = _.kebabCase(clientname)
  return item
})

const mongo_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
mongoose
  .connect(mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((response) => {
    console.log('MongoDB connection successful')
  })
  .then((response) => {
    ClientModel.insertMany(clientsData)
      .then((insertResponse) => {
        console.log('Data seeding successful')
      })
      .catch((insertErr) => {
        console.log(insertErr)
      })
      .finally(() => {
        mongoose.disconnect()
      })
  })
  .catch((err) => {
    console.log(err)
  })

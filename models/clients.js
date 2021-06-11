const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  contact: { type: Number, required: true },
  dateofbirth: { type: Date },
  photo: { type: String },
  address: { type: String },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
    unique: true,
  },
  nextofkin: { type: String },
  nokcontact: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'] },
})

const ClientModel = mongoose.model('Client', clientSchema)

module.exports = {
  ClientModel: ClientModel,
}

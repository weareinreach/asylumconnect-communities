const mongoose = require('mongoose')
const schema = mongoose.Schema

const AuthSchema = new schema({
  secret: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true
  }
}, { collection: 'Auth' })

var Auth = mongoose.model('Auth', AuthSchema)
module.exports = Auth
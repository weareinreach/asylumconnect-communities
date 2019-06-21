const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ThreadSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
  },
  threadType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  authorId: {
    type: String,
    required: true,
  },
  votes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  subcategory: { type: Schema.Types.ObjectId, ref: 'Subcategory' },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
}, { collection: 'threads' })

var ThreadModel = mongoose.model('Thread', ThreadSchema)
module.exports = ThreadModel
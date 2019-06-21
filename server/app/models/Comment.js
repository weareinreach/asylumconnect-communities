const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
  _id: Schema.Types.ObjectId,
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  },
  authorId: { type: String, required: true },
  thread: { type: Schema.Types.ObjectId, ref: 'Thread' },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
}, { collection: 'comments' })

var CommentModel = mongoose.model('Comment', CommentSchema)
module.exports = CommentModel
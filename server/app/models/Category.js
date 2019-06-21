const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Subcategory = require('./Subcategory')

const categorySchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  },
  subcategories: [{ type: Schema.Types.ObjectId, ref: 'Subcategory' }]
}, { collection: 'categories' })

var CategoryModel = mongoose.model('Category', categorySchema)
module.exports = CategoryModel
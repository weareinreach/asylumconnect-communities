const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SubcategorySchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  threads: [{ type: Schema.Types.ObjectId, ref: 'Thread' }]
}, { collection: 'subcategories' })

var SubcategoryModel = mongoose.model('Subcategory', SubcategorySchema)
module.exports = SubcategoryModel
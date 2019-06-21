const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const CategoryModel = require('../models/Category')
const resUtils = require('../utils/responseUtils')
const auth = require('../../middleware/auth')
const verifyTokenData = require('../../app/utils/authUtils').verifyTokenData

const createFailResponse = resUtils.createFailResponse
const createSuccessResponse = resUtils.createSuccessResponse

// This method can return a single category or all categories 
// depending on the presence of the id in the request query.
router.get('/', async (req, res) => {
  const categoryId = req.query.categoryId
  if (categoryId) {
    // Return a single category with subcategories populated.
    CategoryModel.findOne({ '_id': categoryId })
      .populate('subcategories') // This is what takes care of populating the subcategories
      .exec(function (err, category) {
        if (err) {
          return res
            .send(createFailResponse({ 'category': 'No category found with that id' }))
        }
        return res
          .send(createSuccessResponse({ 'category': category }))
      })
  } else {
    // Return an array of all categories.
    CategoryModel.find({})
      .then(categories => res
        .send(createSuccessResponse({ categories })))
      .catch(err => res
        .send(createFailResponse({ 'categories': 'No categories found' })))
  }
})

// Creates a new category and returns it
router.post('/', auth, async (req, res) => {
  const tokenResponse = await verifyTokenData(req)
  if (!tokenResponse) {
    return res.send(createFailResponse({ "category": "You must login first" }));
  }

  const { title } = req.body

  const category = new CategoryModel({
    _id: new mongoose.Types.ObjectId(),
    title: title
  })
  category.save()
    .then(category => {
      return res.status(201).send(createSuccessResponse({ category }))
    })
    .catch(error => {
      return res.send(createFailResponse({ 'category': 'Unable to create category' }))
    })
})

module.exports = router
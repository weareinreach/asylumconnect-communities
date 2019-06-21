const express = require('express')
const mongoose = require('mongoose');
const router = express.Router({ mergeParams: true })
const CategoryModel = require('../models/Category')
const SubcategoryModel = require('../models/Subcategory')
const resUtils = require('../utils/responseUtils')
const auth = require('../../middleware/auth')
const verifyTokenData = require('../../app/utils/authUtils').verifyTokenData

const createErrorResponse = resUtils.createErrorResponse
const createFailResponse = resUtils.createFailResponse
const createSuccessResponse = resUtils.createSuccessResponse

// This method can return a single subcategory or all subcategories 
// depending on the presence of the id in the request query.
router.get('/', async (req, res) => {
  const { categoryId, subcategoryId } = req.query
  if (subcategoryId) {
    // Return a single subcategory with threads populated.
    SubcategoryModel.findOne({ '_id': subcategoryId })
      .populate('threads') // This is what takes care of populating the threads
      .exec(function (err, subcategory) {
        if (err) {
          return res
            .send(createFailResponse({ 'subcategories': 'No subcategories found' }))
        }
        return res.send(createSuccessResponse({ subcategory }))
      })
  }
  else if (categoryId) {
    // Return a single subcategory with threads populated.
    CategoryModel.findOne({ '_id': categoryId })
      .populate('subcategories') // This is what takes care of populating the threads
      .exec(function (err, category) {
        if (err) {
          return res.send(createFailResponse({ 'subcategory': 'No subcategory found with that id' }))
        }
        return res.status(201).send(createSuccessResponse({ "subcategories": category.subcategories }))
      })
  }
  else {
    return res.status(500)
      .send(createErrorResponse('You need to provide a subcategoryId or categoryId'))
  }
})

// Creates a new subcategory and returns it.
router.post('/', auth, async (req, res) => {
  const tokenResponse = await verifyTokenData(req)
  if (!tokenResponse) {
    return res.send(createFailResponse({ "subcategory": "You must login first" }));
  }
  // Find the category this subcategory belongs to.
  const { title, categoryId } = req.body
  CategoryModel
    .findById(categoryId)
    .then(category => {
      // Save the subcategory and give it the category id, because 
      // it needs to have a reference to a category. A category has many subcategories.
      const subcategory = new SubcategoryModel({
        _id: new mongoose.Types.ObjectId(),
        title: title,
        category: categoryId,
      })
      subcategory.save()
        .then(subcategory => {
          // Save the id of the newly created subcategory in the array of
          // subcategory ids in the parent category. 
          category.subcategories.push(subcategory._id)
          category.save()
          return res.status(201).send(createSuccessResponse({ 'subcategory': subcategory }))
        })
        .catch(error => {
          return res.status(500)
            .send(createErrorResponse('Unable to create subcategory'))
        })
    })
    .catch(error => {
      return res.status(500)
        .send(createErrorResponse('Unable to create subcategory'))
    })
})

module.exports = router
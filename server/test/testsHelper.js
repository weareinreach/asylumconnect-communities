const express = require('express')
const mongoose = require('mongoose')
const CategoryModel = require('../app/models/Category')
const SubcategoryModel = require('../app/models/Subcategory')
const ThreadModel = require('../app/models/Thread')
const CommentModel = require('../app/models/Comment')
const uuidv1 = require('uuid/v1');

const createCategory = async () => {
  // Clear all items in database
  CategoryModel.remove({})
  // Creates a category and returns the category id
  const result = {}
  await CategoryModel
    .create({ _id: new mongoose.Types.ObjectId(), title: 'Random Category Title' })
    .then(category => {
      result['category'] = category
    })
    .catch(error => console.log("Error while creating category in test helper function."))
  return result['category']
}

const createSubcategory = async () => {
  // Clear the db
  await CategoryModel.remove({})
  await SubcategoryModel.remove({})
  //Create the subcategory
  const result = {}
  const createdCategory = await createCategory()
  const categoryId = createdCategory._id
  const title = "Random Subcategory Title"
  await CategoryModel
    .findById(categoryId)
    .then(async category => {
      const subcategory = new SubcategoryModel({
        _id: new mongoose.Types.ObjectId(),
        title: title,
        category: categoryId,
      })
      await subcategory.save()
        .then(subcategory => {
          category.subcategories.push(subcategory._id)
          category.save()
          result['subcategory'] = subcategory
        })
        .catch(error => {
          console.log(error)
        })
    })
  return result['subcategory']
}

const createThread = async () => {
  // Clear the db
  await CategoryModel.remove({})
  await SubcategoryModel.remove({})
  await ThreadModel.remove({})
  //Create the thread
  const result = {}
  const createdSubcategory = await createSubcategory()
  const subcategoryId = createdSubcategory._id
  const title = "Random thread title"
  const description = "Random thread description"
  const threadType = "Question"
  const authorId = uuidv1()

  await SubcategoryModel
    .findById(subcategoryId)
    .then(async subcategory => {
      const thread = new ThreadModel({
        _id: new mongoose.Types.ObjectId(),
        title: title,
        threadType: threadType,
        description: description,
        subcategory: subcategoryId,
        authorId: authorId
      })
      await thread.save()
        .then(thread => {
          subcategory.threads.push(thread._id)
          subcategory.save()
          result['thread'] = thread
        })
        .catch(error => {
          console.log("There was an error while trying to create a thread", error)
        })
    })
  return result['thread']
}

const createComment = async () => {
  // Clear the db
  await CategoryModel.remove({})
  await SubcategoryModel.remove({})
  await ThreadModel.remove({})
  await CommentModel.remove({})
  //Create the comment
  const result = {}
  const createdThread = await createThread()
  const threadId = createdThread._id
  const text = "Random comment text"
  const authorId = uuidv1()

  await ThreadModel
    .findById(threadId)
    .then(async thread => {
      const comment = new CommentModel({
        _id: new mongoose.Types.ObjectId(),
        text: text,
        thread: threadId,
        authorId: authorId
      })
      await comment.save()
        .then(comment => {
          thread.comments.push(comment._id)
          thread.save()
          result['comment'] = comment
        })
        .catch(error => {
          console.log(error)
        })
    })
  return result['comment']
}

module.exports = {
  createCategory,
  createSubcategory,
  createThread,
  createComment
}
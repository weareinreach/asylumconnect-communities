const express = require('express')
const mongoose = require('mongoose');
const router = express.Router()
const ThreadModel = require('../models/Thread')
const SubcategoryModel = require('../models/Subcategory')
const CommentModel = require('../models/Comment')
const UserModel = require('../models/User')
const resUtils = require('../utils/responseUtils')
const auth = require('../../middleware/auth')
const verifyTokenData = require('../../app/utils/authUtils').verifyTokenData

const createErrorResponse = resUtils.createErrorResponse
const createFailResponse = resUtils.createFailResponse
const createSuccessResponse = resUtils.createSuccessResponse

//This method returns any threads found that contain a specific keyword
//in the title.
router.get('/search', async (req, res) => {
  let { title } = req.query

  title = title || ""

  const titleRegex = new RegExp(title, 'i')

  ThreadModel.find({ title: titleRegex })
    .then((threads) => {
      return res.send(createSuccessResponse({ threads }))
    })
    .catch((err) => {
      return res.send(createFailResponse({ 'threads': 'Unable to find thread' }))
    })
})

// This method can return a single thread or all threads 
// depending on the presence of the id in the request query.
router.get('/', async (req, res) => {
  const { subcategoryId, threadId } = req.query
  if (threadId) {
    // Return a single thread with comments populated.
    ThreadModel.findOne({ '_id': threadId })
      .populate('comments') // This is what takes care of populating the comments
      .populate('author') // This is what takes care of populating the author
      .exec(function (err, thread) {
        if (err) {
          return res.send(createFailResponse({ 'threads': 'No threads found' }))
        }
        return res.status(200).send(createSuccessResponse({ thread }))
      })
  }
  else if (subcategoryId) {
    // Return a single thread with comments populated.
    SubcategoryModel.findOne({ '_id': subcategoryId })
      .populate('threads') // This is what takes care of populating the threads
      .exec(function (err, subcategory) {
        if (err) {
          return res.send(createFailResponse({ 'thread': 'No thread found with that id' }))
        }
        return res.status(200).send(createSuccessResponse({ 'threads': subcategory.threads }))
      })
  }
  else {
    return res.status(500)
      .send(createErrorResponse('You need to provide a threadId or subcategoryId.'))
  }
})
// Creates a new thread and returns it, checks that user is logged in first.
router.post('/', auth, async (req, res) => {
  const tokenResponse = await verifyTokenData(req)
  if (!tokenResponse) {
    return res.send(createFailResponse({ "thread": "You must login first" }));
  }
  UserModel.findOne({ 'username': req.user.username })
    .then(user => {
      // Find the subcategory this thread belongs to.
      const { title, threadType, description, subcategoryId } = req.body
      console.log(threadType)
      SubcategoryModel.findById(subcategoryId)
        .then(subcategory => {
          // Save the thread and give it the subcategory id, because 
          // it needs to have a reference to a subcategory.
          const thread = new ThreadModel({
            _id: new mongoose.Types.ObjectId(),
            title: title,
            threadType: threadType,
            description: description,
            subcategoryId: subcategoryId,
            authorId: user._id
          })
          thread.save()
            .then(thread => {
              // Save the id of the newly created thread in the array of
              // thread ids in the parent subcategory. 
              subcategory.threads.push(thread._id)
              subcategory.save()
              const response = {
                ...thread._doc,
                author: user.username
              }
              return res.status(201).send(createSuccessResponse({ 'thread': response }))

            })
            .catch(error => {
              return res.status(500).send(createErrorResponse('Unable to save thread'))
            })
        })
    })

})

// Delete a thread post
router.delete('/', auth, async (req, res) => {
  const { threadId } = req.body;
  const thread = await ThreadModel.findOne({ _id: threadId })
  const tokenResponse = await verifyTokenData(req)

  if (!tokenResponse) {
    return res.send(createFailResponse({ "delete": "You must login first" })); //Make sure user is logged in
  }

  const userData = await UserModel.findOne({ username: req.user.username }) //Collect all current user data

  if (userData._id != thread.authorId) { //Throw error if user is not the author of thread
    return res.status(500).send(createFailResponse({ "delete": "You are not the author" }));
  } else if (threadId) {
    SubcategoryModel.findOne({ 'threads': threadId })
      .then(subcategory => {
        let val = subcategory.threads.indexOf(threadId)
        subcategory.threads.splice(val, 1)
      })
      .catch(error => {
        return res.send(createFailResponse({ 'delete': 'No subcategory found' }))
      })
    ThreadModel.findOne({ '_id': threadId }) //Find thread with the current thread ID
      .then(thread => {
        thread.comments.forEach(function (value, index, array) {
          thread.comments.pop()
        })
        thread.comments.splice(0, 1)
        CommentModel.deleteMany({ 'thread': threadId })
        thread.deleteOne()
      })
      .catch(error => {
        return res.send(createFailResponse({ 'delete': 'No thread found' }))
      })
    return res.send(createSuccessResponse({ 'delete': null }))

  }
  else {
    return res.status(500)
      .send(createErrorResponse('You need to provide a threadId.'))
  }
});

// Allow user to vote on a thread
router.post('/vote', async (req, res) => {
  const { threadId } = req.body //Grab thread ID from request
  const tokenResponse = await verifyTokenData(req) //Verify user is logged in

  if (!tokenResponse) {
    return res.send(createFailResponse({ "upVote": "You must login first" }));
  }

  const userData = await UserModel.findOne({ username: req.user.username }) //Pull all data for current user
  let id = String(userData._id)

  if (threadId) {
    ThreadModel.findOne({ '_id': threadId }) //Find thread with the included ID
      .then(thread => {
        let voted = thread.votes.every(function (value, index, array) {
          if (String(array[index]) == id) { //Check every user who has voted against the user trying to vote
            array.splice(index, 1) //splice out the value from the array which is equal to the current user id
            return false
          } else
            return true
        })
        if (voted) {
          thread.votes.push(userData._id) //If the current user has not voted, add user to array
          thread.save()
          return res.send(createSuccessResponse({ 'addVote': [true, thread.votes.length] }))
        }
        else {
          thread.save()
          return res.send(createSuccessResponse({ 'removeVote': [false, thread.votes.length] }))
        }
      })
      .catch(error => {
        return res.send(createFailResponse({ 'upVote': 'No thread found' }))
      })
  }
})

module.exports = router
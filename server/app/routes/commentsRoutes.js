const express = require('express')
const mongoose = require('mongoose');
const router = express.Router()
const CommentModel = require('../models/Comment')
const UserModel = require('../models/User')
const resUtils = require('../utils/responseUtils')
const ThreadModel = require('../models/Thread')
const auth = require('../../middleware/auth')

const createErrorResponse = resUtils.createErrorResponse
const createFailResponse = resUtils.createFailResponse
const createSuccessResponse = resUtils.createSuccessResponse

// This method can return a single comment or all comments 
// depending on the presence of the id in the request query.
router.get('/', async (req, res) => {
  const { threadId, commentId } = req.query
  if (commentId) {
    // Return a single comment with comments populated.
    CommentModel.findOne({ '_id': commentId })
      .populate('comments') // This is what takes care of populating the comments
      .exec(function (err, comment) {
        if (err) {
          return res.send(createFailResponse({ 'comments': 'No comments found' }))
        }
        return res.send(createSuccessResponse({ comment }))
      })
  }
  else if (threadId) {
    // Return a single comment with comments populated.
    ThreadModel.findOne({ '_id': threadId })
      .populate('comments') // This is what takes care of populating the comments
      .exec(function (err, thread) {
        if (err) {
          return res.send(createFailResponse({ 'comment': 'No comment found with that id' }))
        }
        return res.send(createSuccessResponse({ "comments": thread.comments }))
      })
  }
  else {
    return res.status(500)
      .send(createErrorResponse('You need to provide a commentId or threadId.'))
  }
})

// Creates a new comment and returns it
router.post('/', auth, async (req, res) => {
  if (req.user.error) {
    return res.status(401).send(createFailResponse({ "comments": "You need to be signed in to create a comment." }))
  }
  UserModel.findOne({ 'username': req.user.username })
    .then(user => {
      // Find the thread this comment belongs to.
      const { text, threadId } = req.body
      ThreadModel.findById(threadId)
        .then(thread => {
          // Save the comment and give it the thread id, because 
          // it needs to have a reference to a thread.
          const comment = new CommentModel({
            _id: new mongoose.Types.ObjectId(),
            text: text,
            thread: threadId,
            authorId: user._id
          })
          comment.save()
            .then(comment => {
              // Save the id of the newly created comment in the array of
              // comment ids in the parent thread. 
              thread.comments.push(comment._id)
              thread.save()
              const response = {
                ...comment._doc,
                author: user.username
              }
              return res.status(201).send(createSuccessResponse({ 'comment': response }))
            })
            .catch(error => {
              return res.status(500).send(createErrorResponse('Unable to create comment'))
            })
        })
        .catch(error => {
          return res.status(500).send(createErrorResponse('Unable to create comment'))
        })
    })
})

router.delete('/', auth, async(req, res) => {
  const {commentId} = req.body;
  const comment = await ThreadModel.findOne({ _id: threadId })
  const tokenResponse = await verifyTokenData(req)
  
  if (!tokenResponse) {
    return res.send(createFailResponse({ "delete": "You must login first" })); //Make sure user is logged in
  }

  const userData = await UserModel.findOne({ username: req.user.username }) //Collect all current user data

  if (userData._id != comment.authorId){ //Throw error if user is not the author of thread
    return res.status(500).send(createFailResponse({ "delete": "You are not the author" }));
  } else if (commentId) {
    Commentmodel.deleteOne({ '_id' : commentId })
      .catch(error => {
        return res.send(createFailResponse({ 'delete': 'No comment found' }))
      })
    ThreadModel.findOne({ 'comments': commentId })
      .then(thread => {
        let val = thread.comments.indexOf(commentId)
        thread.comments.splice(val, 1)
      })
      .catch(error => {
        return res.send(createFailResponse({ 'delete': 'No thread found' }))
      })
      return res.send(createSuccessResponse({ 'delete': null }))
      
    }
  else {
    return res.status(500)
      .send(createErrorResponse('You need to provide a commentId.'))
  }
});

module.exports = router
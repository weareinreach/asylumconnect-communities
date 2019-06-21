var express = require('express')
const mongoose = require('mongoose');
var router = express.Router()
const resUtils = require('../utils/responseUtils')
const authUtils = require('../utils/authUtils')
const user = require('../models/User')
const auth = require('../../middleware/auth')
const AuthModel = require('../models/Auth')
const bcrypt = require('bcrypt')

const createErrorResponse = resUtils.createErrorResponse
const createFailResponse = resUtils.createFailResponse
const createSuccessResponse = resUtils.createSuccessResponse
const verifyTokenData = authUtils.verifyTokenData
const generateToken = authUtils.generateToken
const validate = authUtils.validate
const validateuser = authUtils.validateuser

/*Authenticate logged in user. Used to get a logged in 
users information, if user is not found a fail response is 
returned, otherwise the username is returned in success response.*/
router.get('/api/hydrate', async (req, res) => {
  if (req.user.error) {
    return res.send(createFailResponse({ Token: req.user.error }))
  }
  else {
    verifyTokenData(req)
      .then(result => {
        if (result)
          res
            .status(200)
            .send(createSuccessResponse({ username: req.user.username }))
        else
          res
            .status(200)
            .send(createErrorResponse('Token is invalid'))
      })
      .catch(err => {
        res
          .status(500)
          .send(createErrorResponse('Error validating token'))
      })
  }
})

/*New user sign up. Checking the db for username, if it already exists in database 
a fail response is returned. If the username does not match an existing user then 
save the new username and password to the database. Generate cookie for logged in 
user.*/
router.post('/api/signup', async (req, res) => {
  const { error } = validate(req.body)

  if (error) {
    return res.send(createFailResponse({ details: error.details }))
  }

  let userdata = await user.findOne({ username: req.body.username })

  if (userdata) {
    return res.send(createFailResponse({ 'username': 'Username already exists' }))
  }

  userdata = new user({ ...req.body, _id: new mongoose.Types.ObjectId() })
  const salt = await bcrypt.genSalt(10)

  userdata.password = await bcrypt.hash(userdata.password, salt)
  userdata.save()
    .then(user => {
      res
        .cookie('auth_data', generateToken(userdata), { httpOnly: true })
        .send(createSuccessResponse({ username: userdata.username }))
    })
    .catch(err => {
      console.log(err)
      return res.send(createErrorResponse('Unable to add new user to database'))
    })
})

//User login
router.post('/api/login', auth, async (req, res) => {
  const { error } = validateuser(req.body)

  if (error) {
    return res.send(createFailResponse({ 'user-validation': error.details[0].message }))
  }
  let userdata = await user.findOne({ username: req.body.username })
  if (!userdata) {
    return res.send(createFailResponse({ 'username': 'Invalid username' }))
  }
  const validatepass = await bcrypt.compare(req.body.password, userdata.password)
  if (!validatepass) {
    return res.send(createFailResponse({ 'password': 'Invalid password' }))
  }
  res
    .cookie('auth_data', generateToken(userdata), { httpOnly: true })
    .send(createSuccessResponse({ username: userdata.username }))
})

//User log out.
router.post('/api/logout', auth, async (req, res) => {
  AuthModel.deleteMany({ username: req.user.username, secret: req.user.secret })
    .then(result => {
      res
        .status(200)
        .clearCookie('auth_data')
        .send(createSuccessResponse(null))
    })
    .catch(err => {
      res
        .status(500)
        .send(createErrorResponse('Unable to log out'))
    })
})

module.exports = router
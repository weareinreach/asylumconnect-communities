const Auth = require('../models/Auth')
const config = require('config')
const jwt = require('jsonwebtoken')
const joi = require('joi')

//used to verify user 
async function verifyTokenData(req, user) {
  if (req.user.error) {
    return null
  }
  try {
    return await Auth.findOne({ username: req.user.username, secret: req.user.secret })
  }
  catch (ex) {
    console.log('Exception: ' + ex)
    return null
  }
}

//used to generate a token for logged in user
function generateToken(userdata) {
  const secret = Math.random().toString(36).slice(-18) + Date.now()
  const token = jwt.sign({
    username: userdata.username,
    secret: secret,
    lifetime: 3600
  }, getJwtPrivateKey())
  const tokenData = new Auth({ secret: secret, username: userdata.username })
  tokenData.save()
  return token
}

//validation for username and password. Username must be a 
//minimum of 3 characters and password a minimum of 8.
//used for sign up
function validate(user) {
  const schema = {
    username: joi.string().min(3).required(),
    password: joi.string().min(8).required(),
  }
  return joi.validate(user, schema)
}

//validation for username and password. Username must be a 
//minimum of 3 characters and password a minimum of 8. 
//used for user sign in
function validateuser(req) {
  const schema = {
    username: joi.string().min(6).required(),
    password: joi.string().min(8).required()
  }
  return joi.validate(req, schema)
}

// if the environment is production then return the production variable
// else check in config file and return the value from 
  // else check in config file and return the value from 
// else check in config file and return the value from 
function getJwtPrivateKey() {
  if (process.env.NODE_ENV === 'production') {

    return process.env.JWT_PRIVATE_KEY
  }
  return config.get('jwtPrivateKey')
}

module.exports = {
  verifyTokenData: verifyTokenData,
  generateToken: generateToken,
  validate: validate,
  validateuser: validateuser,
  getJwtPrivateKey: getJwtPrivateKey
}
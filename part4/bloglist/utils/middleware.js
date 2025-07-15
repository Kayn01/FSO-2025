const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')){
    return response.status(400).json({ error: 'expected `usename` to be unique'})
  } else if (error.name === 'JsonWebTokenError'){
    return response.status(401).json({ error: 'token invalid' })
  }else {
  return response.status(500).json({ error: 'internal server error' })
}

  next(error)
}

const tokenExtractor = (request, response, next) => {
  // code that extracts the token
    const authorization = request.get('authorization')
    if(authorization && authorization.startsWith('Bearer ')) {
        request.token =  authorization.replace('Bearer ', '')
    }else{
        request.token = null
    }

    next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token

  if(!token){
    request.user = null
    return next()
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if(!decodedToken.id){
      request.user = null
      return next()
    }

    const user = await User.findById(decodedToken.id)

    if(user){
      request.user = user
    }else {
      request.user = null
    }
    next()
  }catch(error){
    console.error('Error in userExtractor:', error.message)
    request.user = null
    next()
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
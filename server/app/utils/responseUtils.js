const SUCCESS = 'success'
const ERROR = 'error'
const FAIL = 'fail'

//functions used to respond to api calls 

function createFailResponse(data) {
  return { 
    status: FAIL,
    data: data,
  }
}

function createSuccessResponse(data) {
  return {
    status: SUCCESS,
    data: data,
  }
}

function createErrorResponse(message) {
  return {
    status: ERROR,
    message: message,
  }
}

module.exports = {
  createErrorResponse: createErrorResponse,
  createSuccessResponse: createSuccessResponse,
  createFailResponse: createFailResponse
}

const httpStatusCode = require('http-status-codes');

class CustomConflictError extends Error {
  constructor(message = "Item already created") {
    super(message);
    this.name = "Conflict error";
    this.message = message;
    this.status = httpStatusCode.CONFLICT;
  }
}

class CustomBadRequestError extends Error {
  constructor(message = "Error in parameters") {
    super(message);
    this.name = "BadRequest error";
    this.message = message;
    this.status = httpStatusCode.BAD_REQUEST;
  }
}

module.exports = {
  CustomConflictError,
  CustomBadRequestError
}
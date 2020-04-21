const httpStatusCode = require("http-status-codes");

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

class CustomUnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "Unauthorized error";
    this.message = message;
    this.status = httpStatusCode.UNAUTHORIZED;
  }
}

class CustomNotFoundError extends Error {
  constructor(message = "Not found") {
    super(message);
    this.name = "Not Found error";
    this.message = message;
    this.status = httpStatusCode.NOT_FOUND;
  }
}

module.exports = {
  CustomConflictError,
  CustomBadRequestError,
  CustomUnauthorizedError,
  CustomNotFoundError,
};

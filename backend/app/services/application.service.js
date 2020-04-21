require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});
const jwt = require("jsonwebtoken");

module.exports = {
  switchError: (err) => {
    return [
      err.status || 500,
      {
        error: !err.status || err.status >= 500 ? "Internal error" : err.name,
        error_description:
          !err.status || err.status >= 500
            ? "Internal error server"
            : err.message,
      },
    ];
  },
  generateToken: (encode = {}) => {
    return jwt.sign(encode, process.env.APP_SECRET);
  },
};

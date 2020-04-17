const Joi = require('@hapi/joi');

module.exports = {
  createUserSchema: {
    body: Joi.object({
      email: Joi.string().min(1).email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required(),
      name: Joi.string().min(1).required(),
      password: Joi.string().min(6).required(),
      confirm_password: Joi.ref('password')
    })
  },
  authenticateUserSchema: {
    body: Joi.object({
      email: Joi.string().min(1).email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required(),
      password: Joi.string().min(6).required()
    })
  }
}
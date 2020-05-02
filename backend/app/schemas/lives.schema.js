const Joi = require("@hapi/joi");

module.exports = {
  createLiveSchema: {
    body: Joi.object({
      title: Joi.string().min(1).required(),
      description: Joi.string().min(1).required(),
      date: Joi.date().required(),
      time: Joi.string().min(1).required(),
      reminder: Joi.number().integer().required(),
    }),
  },
};

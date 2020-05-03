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
  getLivesSchema: {
    query: Joi.object({
      page: Joi.number().integer(),
      page_size: Joi.number().integer(),
      search: Joi.string().min(1),
    }),
  },
};

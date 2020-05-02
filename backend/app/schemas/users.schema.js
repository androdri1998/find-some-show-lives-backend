const Joi = require("@hapi/joi");

module.exports = {
  createUserSchema: {
    body: Joi.object({
      email: Joi.string()
        .min(1)
        .email({ minDomainSegments: 2, tlds: { allow: ["com"] } })
        .required(),
      name: Joi.string().min(1).required(),
      password: Joi.string().min(6).required(),
      confirm_password: Joi.ref("password"),
    }),
  },
  authenticateUserSchema: {
    body: Joi.object({
      email: Joi.string()
        .min(1)
        .email({ minDomainSegments: 2, tlds: { allow: ["com"] } })
        .required(),
      password: Joi.string().min(6).required(),
    }),
  },
  getUserSchema: {
    params: Joi.object({
      user_id: Joi.string().uuid().required(),
    }),
  },
  getUsersSchema: {
    query: Joi.object({
      page: Joi.number().integer(),
      page_size: Joi.number().integer(),
      search: Joi.string().min(1),
    }),
  },
  followUserSchema: {
    body: Joi.object({
      following_id: Joi.string().uuid().required(),
    }),
  },
  unfollowUserSchema: {
    body: Joi.object({
      following_id: Joi.string().uuid().required(),
    }),
  },
  putUserSchema: {
    params: Joi.object({
      user_id: Joi.string().uuid().required(),
    }),
    body: Joi.object({
      photo: Joi.string(),
      name: Joi.string(),
    }),
  },
  updateEmailUserSchema: {
    params: Joi.object({
      user_id: Joi.string().uuid().required(),
    }),
    body: Joi.object({
      email: Joi.string()
        .min(1)
        .email({ minDomainSegments: 2, tlds: { allow: ["com"] } }),
    }),
  },
  getFollowingsSchema: {
    params: Joi.object({
      user_id: Joi.string().uuid().required(),
    }),
    query: Joi.object({
      page: Joi.number().integer().default(0),
      page_size: Joi.number().integer().default(15),
    }),
  },
  getFollowersSchema: {
    params: Joi.object({
      user_id: Joi.string().uuid().required(),
    }),
    query: Joi.object({
      page: Joi.number().integer().default(0),
      page_size: Joi.number().integer().default(15),
    }),
  },
};

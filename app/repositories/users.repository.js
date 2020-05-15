const { User } = require("../models");

module.exports = {
  createUserRepository: async (params) => {
    let user;
    try {
      user = await User.create(params);
    } catch (err) {
      throw err;
    }

    return user;
  },
  getOneUserRepository: async (params) => {
    let user;
    try {
      user = await User.findOne({ where: { ...params } });
    } catch (err) {
      throw err;
    }

    return user;
  },
  getUsersRepository: async ({ limit = 10, offset = 0, ...params }) => {
    let responseQuery;
    try {
      responseQuery = await User.findAndCountAll({
        attributes: { exclude: ["password"] },
        where: { ...params },
        offset: offset,
        limit: limit,
      });
    } catch (err) {
      throw err;
    }

    return [responseQuery.count, responseQuery.rows];
  },
  updateUserRepository: async (newUser, params) => {
    let user;
    try {
      user = await User.update(newUser, {
        where: { ...params },
      });
    } catch (err) {
      throw err;
    }

    return user;
  },
};

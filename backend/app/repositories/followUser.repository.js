const { FollowUser } = require("../models");

module.exports = {
  followUserRepository: async (params) => {
    let response;
    try {
      response = await FollowUser.create(params);
    } catch (err) {
      throw err;
    }

    return response;
  },
  getOneFollowRepository: async (params) => {
    let response;
    try {
      response = await FollowUser.findOne({ where: { ...params } });
    } catch (err) {
      throw err;
    }

    return response;
  },
  dropFollowRepository: async (params) => {
    let response;
    try {
      response = await FollowUser.update(
        { active: false },
        {
          where: { ...params },
        }
      );
    } catch (err) {
      throw err;
    }

    return response;
  },
};

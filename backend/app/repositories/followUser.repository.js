const moment = require("moment");
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
  getFollowsRepository: async ({ limit = 10, offset = 0, ...params }) => {
    let responseQuery;
    try {
      responseQuery = await FollowUser.findAndCountAll({
        where: { ...params },
        offset: offset,
        limit: limit,
      });
    } catch (err) {
      throw err;
    }

    return [responseQuery.count, responseQuery.rows];
  },
  dropFollowRepository: async (params) => {
    let response;
    const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
    try {
      response = await FollowUser.update(
        { active: false, updated_at: updatedAt },
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

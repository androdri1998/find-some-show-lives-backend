const { Live } = require("../models");

module.exports = {
  createLiveRepository: async (params) => {
    let response;
    try {
      response = await Live.create(params);
    } catch (err) {
      throw err;
    }

    return response;
  },
  getOneLiveRepository: async (params) => {
    let live;
    try {
      live = await Live.findOne({ where: { ...params } });
    } catch (err) {
      throw err;
    }

    return live;
  },
  getLivesRepository: async ({ limit = 10, offset = 0, ...params }) => {
    let responseQuery;
    try {
      responseQuery = await Live.findAndCountAll({
        where: { ...params },
        offset: offset,
        limit: limit,
      });
    } catch (err) {
      throw err;
    }

    return [responseQuery.count, responseQuery.rows];
  },
  updateLiveRepository: async (newLive, params) => {
    let live;
    try {
      live = await Live.update(newLive, {
        where: { ...params },
      });
    } catch (err) {
      throw err;
    }

    return live;
  },
};

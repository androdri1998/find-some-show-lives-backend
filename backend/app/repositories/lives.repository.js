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
};

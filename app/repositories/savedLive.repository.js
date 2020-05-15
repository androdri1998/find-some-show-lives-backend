const moment = require("moment");
const { SavedLive } = require("../models");

module.exports = {
  savedLiveRepository: async (params) => {
    let response;
    try {
      response = await SavedLive.create(params);
    } catch (err) {
      throw err;
    }

    return response;
  },
  getOneSavedLiveRepository: async (params) => {
    let saveLive;
    try {
      saveLive = await SavedLive.findOne({ where: { ...params } });
    } catch (err) {
      throw err;
    }

    return saveLive;
  },
  unsaveLiveRepository: async (params) => {
    let response;
    const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
    try {
      response = await SavedLive.update(
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
  getSavedLivesRepository: async ({ limit = 10, offset = 0, ...params }) => {
    let responseQuery;
    try {
      responseQuery = await SavedLive.findAndCountAll({
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

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
};

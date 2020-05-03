const uuid = require("uuid/v4");
const moment = require("moment");
const { Op } = require("sequelize");
const {} = require("../utils/Errors");
const {
  createLiveRepository,
  getLivesRepository,
} = require("../repositories/lives.repository");

module.exports = {
  createLiveFactory: async (params) => {
    let live;
    try {
      const { title, description, date, time, reminder, userId } = params;

      const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
      const liveParams = {
        id: uuid(),
        title: title,
        description: description,
        date: `${date} ${time}`,
        reminder_in: reminder,
        creator: userId,
        created_at: createdAt,
        updated_at: createdAt,
        active: true,
      };
      live = await createLiveRepository(liveParams);
    } catch (err) {
      throw err;
    }

    return {
      id: live.id,
      message: "Live created with sucess",
    };
  },
  getLivesFactory: async (params) => {
    const { page = 0, page_size = 10, search } = params;

    const offset = page_size * page;

    let where = {};
    if (search) {
      where = {
        [Op.or]: {
          description: {
            [Op.like]: `${search}%`,
          },
          title: {
            [Op.like]: `${search}%`,
          },
        },
      };
    }

    const [total, lives] = await getLivesRepository({
      limit: page_size,
      offset: offset,
      ...where,
    });

    return {
      total: total,
      results: lives,
    };
  },
};

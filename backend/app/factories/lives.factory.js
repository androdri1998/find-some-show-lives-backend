const uuid = require("uuid/v4");
const moment = require("moment");
const { Op } = require("sequelize");
const { CustomNotFoundError, CustomConflictError } = require("../utils/Errors");
const {
  createLiveRepository,
  getLivesRepository,
  getOneLiveRepository,
  updateLiveRepository,
} = require("../repositories/lives.repository");
const { getOneUserRepository } = require("../repositories/users.repository");

module.exports = {
  createLiveFactory: async (params) => {
    let live;
    try {
      const { title, description, date, time, reminder, userId } = params;

      const user = await getOneUserRepository({ id: userId });
      if (!user) throw new CustomNotFoundError("User not found");

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
  deleteLiveFactory: async (params) => {
    const { live_id } = params;

    const live = await getOneLiveRepository({ id: live_id });
    if (!live) throw new CustomNotFoundError("Live not found");

    if (!live.active) throw new CustomConflictError("Live already deleted");

    await updateLiveRepository(
      {
        active: false,
      },
      { id: live_id }
    );

    return {
      id: live_id,
      message: "Live deleted with sucess.",
    };
  },
  getLivesUserFactory: async (params) => {
    const { page = 0, page_size = 10, search, userId } = params;

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
        creator: userId,
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

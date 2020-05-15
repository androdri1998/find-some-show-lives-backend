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
const {
  savedLiveRepository,
  unsaveLiveRepository,
  getOneSavedLiveRepository,
} = require("../repositories/savedLive.repository");

module.exports = {
  createLiveFactory: async (params) => {
    let live;
    try {
      const { title, description, date, time, reminder, userDecoded } = params;

      const user = await getOneUserRepository({ id: userDecoded.id });
      if (!user) throw new CustomNotFoundError("User not found");

      const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
      const liveParams = {
        id: uuid(),
        title: title,
        description: description,
        date: `${date} ${time}`,
        reminder_in: reminder,
        creator: userDecoded.id,
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
    const { page = 0, page_size = 10, search, userDecoded } = params;

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

    for (const key in lives) {
      const live = lives[key];
      const isSaved = await getOneSavedLiveRepository({
        user_id: userDecoded.id,
        live_id: live.id,
        active: true,
      });
      lives[key].setDataValue("saved", isSaved ? true : false);
    }

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
    const { page = 0, page_size = 10, search, userDecoded } = params;

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
        creator: userDecoded.id,
      };
    }

    const [total, lives] = await getLivesRepository({
      limit: page_size,
      offset: offset,
      ...where,
    });

    for (const key in lives) {
      const live = lives[key];
      const isSaved = await getOneSavedLiveRepository({
        user_id: userDecoded.id,
        live_id: live.id,
        active: true,
      });
      lives[key].setDataValue("saved", isSaved ? true : false);
    }

    return {
      total: total,
      results: lives,
    };
  },
  saveLiveFactory: async (params) => {
    let saved;
    const { live_id, userDecoded } = params;
    try {
      const user = await getOneUserRepository({ id: userDecoded.id });
      if (!user) throw new CustomNotFoundError("User not found");

      const live = await getOneLiveRepository({ id: live_id });
      if (!live) throw new CustomNotFoundError("Live not found");

      const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
      const savedLiveParams = {
        id: uuid(),
        user_id: userDecoded.id,
        live_id: live_id,
        created_at: createdAt,
        updated_at: createdAt,
        active: true,
      };
      saved = await savedLiveRepository(savedLiveParams);
    } catch (err) {
      throw err;
    }

    return {
      id: saved.id,
      message: "Live saved with sucess",
    };
  },
  unsaveLiveFactory: async (params) => {
    const { live_id, userDecoded } = params;
    try {
      const user = await getOneUserRepository({ id: userDecoded.id });
      if (!user) throw new CustomNotFoundError("User not found");

      const live = await getOneLiveRepository({ id: live_id });
      if (!live) throw new CustomNotFoundError("Live not found");

      await unsaveLiveRepository({ live_id: live_id, user_id: userDecoded.id });
    } catch (err) {
      throw err;
    }

    return {
      id: live_id,
      message: "Live unsaved with sucess",
    };
  },
};

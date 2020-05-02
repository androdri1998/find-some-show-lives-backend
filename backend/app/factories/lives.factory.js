const uuid = require("uuid/v4");
const moment = require("moment");
const {
  CustomUnauthorizedError,
  CustomNotFoundError,
  CustomConflictError,
} = require("../utils/Errors");
const { createLiveRepository } = require("../repositories/lives.repository");

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
};

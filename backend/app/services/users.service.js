const moment = require("moment");
const bcrypt = require("bcryptjs");
const uuid = require("uuid/v4");
const { CustomConflictError } = require("../utils/Errors");
const { createUserRepository } = require("../repositories/users.repository");

module.exports = {
  createUsersService: async ({ email, name, password }) => {
    const createdAt = moment().format("YYYY-MM-DD hh:mm:ss");
    let user;
    const hash_password = await bcrypt.hash(password, 8);
    try {
      user = await createUserRepository({
        id: uuid(),
        name: name,
        email: email,
        profile_photo: null,
        password: hash_password,
        created_at: createdAt,
        updated_at: createdAt,
        active: true,
      });
    } catch (err) {
      throw new CustomConflictError(err.message);
    }

    return user;
  },
};

const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { createUsersService } = require("../services/users.service");
const { generateToken } = require("../services/application.service");
const {
  CustomUnauthorizedError,
  CustomNotFoundError,
} = require("../utils/Errors");
const {
  getOneUserRepository,
  getUsersRepository,
} = require("../repositories/users.repository");

module.exports = {
  createUsers: async (params) => {
    let user;
    try {
      user = await createUsersService(params);
    } catch (err) {
      throw err;
    }

    return {
      id: user.id,
      message: "User created with sucess",
    };
  },
  authenticateUser: async (params) => {
    const { email, password } = params;

    const user = await getOneUserRepository({ email });
    if (!user) throw new CustomUnauthorizedError("User not found");

    if (!(await bcrypt.compare(password, user.password)))
      throw new CustomUnauthorizedError("Incorrect password");

    const access_token = generateToken({ id: user.id });

    return {
      access_token: access_token,
    };
  },
  getUser: async (params) => {
    const { user_id } = params;

    const user = await getOneUserRepository({ id: user_id });
    if (!user) throw new CustomNotFoundError("User not found");

    user.password = undefined;

    return { user };
  },
  getUsers: async (params) => {
    const { page = 0, page_size = 10, search } = params;

    const offset = page_size * page;

    let where = {};
    if (search) {
      where = {
        name: {
          [Op.like]: `${search}%`,
        },
      };
    }

    const [total, users] = await getUsersRepository({
      limit: page_size,
      offset: offset,
      ...where,
    });

    return {
      total: total,
      results: users,
    };
  },
};

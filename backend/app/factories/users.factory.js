const bcrypt = require("bcryptjs");
const uuid = require("uuid/v4");
const moment = require("moment");
const { Op } = require("sequelize");
const { createUsersService } = require("../services/users.service");
const { generateToken } = require("../services/application.service");
const {
  CustomUnauthorizedError,
  CustomNotFoundError,
  CustomConflictError,
} = require("../utils/Errors");
const {
  getOneUserRepository,
  getUsersRepository,
  updateUserRepository,
} = require("../repositories/users.repository");
const {
  followUserRepository,
  getOneFollowRepository,
  dropFollowRepository,
  getFollowsRepository,
} = require("../repositories/followUser.repository");

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
  followUser: async (params) => {
    const { userId, following_id } = params;

    try {
      const alreadyFollow = await getOneFollowRepository({
        [Op.and]: [
          { follower_id: userId },
          { following_id: following_id },
          { active: true },
        ],
      });
      if (alreadyFollow) throw new CustomConflictError("Already follow user");
    } catch (err) {
      throw err;
    }

    const followId = uuid();
    try {
      const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
      await followUserRepository({
        id: followId,
        follower_id: userId,
        following_id: following_id,
        created_at: createdAt,
        updated_at: createdAt,
        active: true,
      });
    } catch (err) {
      throw err;
    }

    return {
      id: followId,
      message: "User followed with success.",
    };
  },
  unfollowUser: async (params) => {
    const { userId, following_id } = params,
      whereFollow = {
        [Op.and]: [
          { follower_id: userId },
          { following_id: following_id },
          { active: true },
        ],
      };

    let alreadyFollow;
    try {
      alreadyFollow = await getOneFollowRepository(whereFollow);
      if (!alreadyFollow)
        throw new CustomConflictError("Already unfollow user");
    } catch (err) {
      throw err;
    }

    try {
      await dropFollowRepository(whereFollow);
    } catch (err) {
      throw err;
    }

    return {
      id: alreadyFollow.id,
      message: "User unfollowed with success.",
    };
  },
  logoutUser: async (params) => {
    return {
      id: params.userId,
      message: "Logout with success.",
    };
  },
  updateUser: async (params) => {
    const { user_id, ...userUpdate } = params;
    const user = await getOneUserRepository({ id: user_id });
    if (!user) throw new CustomNotFoundError("User not found");

    try {
      await updateUserRepository(userUpdate, { id: user_id });
    } catch (err) {
      throw err;
    }

    return {
      id: user_id,
      message: "User updated with success.",
    };
  },
  updateEmailUser: async (params) => {
    const { user_id, ...userUpdate } = params;
    const user = await getOneUserRepository({ id: user_id });
    if (!user) throw new CustomNotFoundError("User not found");

    try {
      await updateUserRepository(userUpdate, { id: user_id });
    } catch (err) {
      throw err;
    }

    return {
      id: user_id,
      message: "Email user updated with success.",
    };
  },
  deleteUser: async (params) => {
    const { user_id } = params;
    const user = await getOneUserRepository({ id: user_id });
    if (!user) throw new CustomNotFoundError("User not found");

    try {
      await updateUserRepository({ active: false }, { id: user_id });
    } catch (err) {
      throw err;
    }

    return {
      id: user_id,
      message: "Email user updated with success.",
    };
  },
  getFollowings: async (params) => {
    const { page = 0, page_size = 10, user_id } = params;

    const offset = page_size * page;

    const [total, follows] = await getFollowsRepository({
      limit: page_size,
      offset: offset,
      follower_id: user_id,
      active: true,
    });

    return {
      total: total,
      results: follows,
    };
  },
  getFollowers: async (params) => {
    const { page = 0, page_size = 10, user_id } = params;

    const offset = page_size * page;

    const [total, follows] = await getFollowsRepository({
      limit: page_size,
      offset: offset,
      following_id: user_id,
      active: true,
    });

    return {
      total: total,
      results: follows,
    };
  },
};

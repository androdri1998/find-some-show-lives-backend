const routes = require("express").Router();
const usersController = require("../app/controllers/users.controller");
const livesController = require("../app/controllers/lives.controller");

const validateParams = require("../app/middlewares/validateParams");
const authMiddleware = require("../app/middlewares/auth");

const {
  createUserSchema,
  authenticateUserSchema,
  getUserSchema,
  getUsersSchema,
  followUserSchema,
  unfollowUserSchema,
  putUserSchema,
  updateEmailUserSchema,
  getFollowingsSchema,
  getFollowersSchema,
  getSavedLivesUserSchema
} = require("../app/schemas/users.schema");
const { getLivesUserSchema } = require("../app/schemas/lives.schema");

routes.post(
  "/",
  validateParams(createUserSchema, "body"),
  usersController.createUsers
);
routes.post(
  "/auth",
  validateParams(authenticateUserSchema, "body"),
  usersController.authenticateUser
);

routes.use(authMiddleware);
routes.get(
  "/",
  validateParams(getUsersSchema, "query"),
  usersController.getUsers
);
routes.put(
  "/follow-user",
  validateParams(followUserSchema, "body"),
  usersController.followUser
);
routes.put(
  "/unfollow-user",
  validateParams(unfollowUserSchema, "body"),
  usersController.unfollowUser
);
routes.put("/logout", usersController.logoutUser);
routes.get(
  "/:user_id",
  validateParams(getUserSchema, "params"),
  usersController.getUser
);
routes.put(
  "/:user_id",
  [
    validateParams(putUserSchema, "params"),
    validateParams(putUserSchema, "body"),
  ],
  usersController.updateUser
);
routes.delete("/:user_id", usersController.deleteUser);
routes.put(
  "/:user_id/update-email",
  [
    validateParams(updateEmailUserSchema, "params"),
    validateParams(updateEmailUserSchema, "body"),
  ],
  usersController.updateEmailUser
);

routes.get(
  "/:user_id/followings",
  [
    validateParams(getFollowingsSchema, "params"),
    validateParams(getFollowingsSchema, "query"),
  ],
  usersController.getFollowings
);

routes.get(
  "/:user_id/followers",
  [
    validateParams(getFollowersSchema, "params"),
    validateParams(getFollowersSchema, "query"),
  ],
  usersController.getFollowers
);

routes.get(
  "/:user_id/lives",
  [
    validateParams(getLivesUserSchema, "params"),
    validateParams(getLivesUserSchema, "query"),
  ],
  livesController.getLivesUser
);

routes.get(
  "/:user_id/saved-lives",
  [
    validateParams(getSavedLivesUserSchema, "params"),
    validateParams(getSavedLivesUserSchema, "query"),
  ],
  usersController.getSavedLivesUser
);

module.exports = routes;

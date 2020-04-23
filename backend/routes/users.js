const routes = require("express").Router();
const usersController = require("../app/controllers/users.controller");

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
} = require("../app/schemas/users.schema");

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

module.exports = routes;

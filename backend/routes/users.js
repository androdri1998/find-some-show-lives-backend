const routes = require("express").Router();
const usersController = require("../app/controllers/users.controller");

const validateParams = require("../app/middlewares/validateParams");
const authMiddleware = require("../app/middlewares/auth");

const {
  createUserSchema,
  authenticateUserSchema,
  getUserSchema,
  getUsersSchema,
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
  "/:user_id",
  validateParams(getUserSchema, "params"),
  usersController.getUser
);
routes.get(
  "/",
  validateParams(getUsersSchema, "query"),
  usersController.getUsers
);

module.exports = routes;

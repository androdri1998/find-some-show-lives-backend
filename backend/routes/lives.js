const routes = require("express").Router();
const livesController = require("../app/controllers/lives.controller");

const validateParams = require("../app/middlewares/validateParams");
const authMiddleware = require("../app/middlewares/auth");

const {
  createLiveSchema,
  getLivesSchema,
} = require("../app/schemas/lives.schema");

routes.use(authMiddleware);

routes.post(
  "/",
  validateParams(createLiveSchema, "body"),
  livesController.createLive
);

routes.get(
  "/",
  validateParams(getLivesSchema, "query"),
  livesController.getLives
);

module.exports = routes;

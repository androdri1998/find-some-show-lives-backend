const routes = require("express").Router();
const livesController = require("../app/controllers/lives.controller");

const validateParams = require("../app/middlewares/validateParams");
const authMiddleware = require("../app/middlewares/auth");

const {
  createLiveSchema,
  getLivesSchema,
  deleteLiveSchema,
  saveLiveSchema,
  unsaveLiveSchema,
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

routes.delete(
  "/:live_id",
  validateParams(deleteLiveSchema, "params"),
  livesController.deleteLive
);

routes.put(
  "/:live_id/save-live",
  validateParams(saveLiveSchema, "params"),
  livesController.saveLive
);

routes.put(
  "/:live_id/unsave-live",
  validateParams(unsaveLiveSchema, "params"),
  livesController.unsaveLive
);

module.exports = routes;

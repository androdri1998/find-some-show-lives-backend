const routes = require('express').Router();
const usersController = require('../app/controllers/users.controller');

const validateParams = require('../app/middlewares/validateParams');

const { createUserSchema } = require('../app/schemas/users.schema');

routes.post('/', validateParams(createUserSchema, 'body'), usersController.createUsers);

module.exports = routes;
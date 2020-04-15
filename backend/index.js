const express = require('express');
const cors = require('cors');

const usersController = require('./app/controllers/users.controller');

const validateParams = require('./app/middlewares/validateParams');

const { createUserSchema } = require('./app/schemas/users.schema');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/users', validateParams(createUserSchema, 'body'), usersController.createUsers);

app.listen(8088);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createUsersService } = require('../services/users.service');
const { CustomUnauthorizedError, CustomNotFoundError } = require('../utils/Errors');
const { getOneUserRepository } = require('../repositories/users.repository');

module.exports = {
  createUsers: async (params) => {
    let user;
    try{
      user = await createUsersService(params);
    } catch(err) {
      throw err;
    }
  
    return {
      id: user.id,
      message: "User created with sucess"
    }
  },
  authenticateUser: async (params) => {
    const { email, password } = params;

    const user = await getOneUserRepository({ email });
    if(!user)
      throw new CustomUnauthorizedError("User not found");

    if(!(await bcrypt.compare(password, user.password)))
      throw new CustomUnauthorizedError("Incorrect password");

    const access_token = jwt.sign({ id: user.id }, process.env.APP_SECRET);

    return {
      access_token: access_token
    }
  },
  getUser: async (params) => {
    const { user_id } = params;

    const user = await getOneUserRepository({ id: user_id });
    if(!user)
      throw new CustomNotFoundError("User not found");

    user.password = undefined;

    return { user };
  }
}
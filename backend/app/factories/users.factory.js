const moment = require('moment');
const uuid = require('uuid/v4');
const { User } = require('../models');
const { CustomConflictError } = require('../utils/Errors');

module.exports = {
  createUsers: async (params) => {
    const { email, name, password } = params;
    
    const createdAt = moment().format("YYYY-MM-DD hh:mm:ss");
    let user;
    try{
      user = await User.create({
        id: uuid(),
        name: name,
        email: email,
        profile_photo: null,
        password: password,
        created_at: createdAt,
        updated_at: createdAt,
        active: true
      });
    } catch(err) {
      throw new CustomConflictError(err.message);
    }
  
    return {
      id: user.id
    }
  }
}
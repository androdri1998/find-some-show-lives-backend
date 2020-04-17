const { User } = require('../models');

module.exports={
  createUserRepository: async (params) => {
    let user;
    try{
      user = await User.create(params);
    } catch(err) {
      throw err;
    }

    return user;
  },
  getOneUserRepository: async (params) => {
    let user;
    try{
      user = await User.findOne({ where: { ...params } });
    } catch(err) {
      throw err;
    }

    return user;
  }
}
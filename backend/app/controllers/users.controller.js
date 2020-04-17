const usersFactory = require('../factories/users.factory');
const { switchError } = require('../services/application.service');

module.exports = {
  createUsers: async (req, res) => {
    try{
      const response = await usersFactory.createUsers({ ...req.body, ...req.query, ...req.params});
      return res.status(201).json(response);
    } catch(err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  }
}
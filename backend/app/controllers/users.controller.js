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
  },
  authenticateUser: async (req, res) => {
    try{
      const response = await usersFactory.authenticateUser({ ...req.body, ...req.query, ...req.params});
      return res.status(200).json(response);
    } catch(err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
  getUser: async (req, res) => {
    try{
      const response = await usersFactory.getUser({ ...req.body, ...req.query, ...req.params});
      return res.status(200).json(response);
    } catch(err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
  getUsers: async (req, res) => {
    try{
      const response = await usersFactory.getUsers({ ...req.body, ...req.query, ...req.params});
      return res.status(200).json(response);
    } catch(err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  }
}
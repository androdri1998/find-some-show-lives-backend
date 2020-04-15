const usersFactory = require('../factories/users.factory');

module.exports = {
  createUsers: async (req, res) => {
    const response = await usersFactory.createUsers({ ...req.body, ...req.query, ...req.params});
    return res.json(response);
  }
}
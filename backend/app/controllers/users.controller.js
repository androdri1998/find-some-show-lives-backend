const usersFactory = require("../factories/users.factory");
const { switchError } = require("../services/application.service");

module.exports = {
  createUsers: async (req, res) => {
    try {
      const response = await usersFactory.createUsers({
        ...req.body,
        ...req.query,
        ...req.params,
      });
      return res.status(201).json(response);
    } catch (err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
  authenticateUser: async (req, res) => {
    try {
      const response = await usersFactory.authenticateUser({
        ...req.body,
        ...req.query,
        ...req.params,
      });
      return res.status(200).json(response);
    } catch (err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
  getUser: async (req, res) => {
    try {
      const response = await usersFactory.getUser({
        ...req.body,
        ...req.query,
        ...req.params,
      });
      return res.status(200).json(response);
    } catch (err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
  getUsers: async (req, res) => {
    try {
      const response = await usersFactory.getUsers({
        ...req.body,
        ...req.query,
        ...req.params,
      });
      return res.status(200).json(response);
    } catch (err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
  followUser: async (req, res) => {
    try {
      const response = await usersFactory.followUser({
        ...req.body,
        ...req.query,
        ...req.params,
        userId: req.userId,
      });
      return res.status(201).json(response);
    } catch (err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
  unfollowUser: async (req, res) => {
    try {
      const response = await usersFactory.unfollowUser({
        ...req.body,
        ...req.query,
        ...req.params,
        userId: req.userId,
      });
      return res.status(201).json(response);
    } catch (err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
  logoutUser: async (req, res) => {
    try {
      const response = await usersFactory.logoutUser({
        ...req.body,
        ...req.query,
        ...req.params,
        userId: req.userId,
      });
      return res.status(201).json(response);
    } catch (err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
  updateUser: async (req, res) => {
    try {
      const response = await usersFactory.updateUser({
        ...req.body,
        ...req.query,
        ...req.params,
        userId: req.userId,
      });
      return res.status(201).json(response);
    } catch (err) {
      console.log(err);
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
  updateEmailUser: async (req, res) => {
    try {
      const response = await usersFactory.updateEmailUser({
        ...req.body,
        ...req.query,
        ...req.params,
        userId: req.userId,
      });
      return res.status(201).json(response);
    } catch (err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const response = await usersFactory.deleteUser({
        ...req.body,
        ...req.query,
        ...req.params,
        userId: req.userId,
      });
      return res.status(200).json(response);
    } catch (err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
  getFollowings: async (req, res) => {
    try {
      const response = await usersFactory.getFollowings({
        ...req.body,
        ...req.query,
        ...req.params,
        userId: req.userId,
      });
      return res.status(200).json(response);
    } catch (err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
  getFollowers: async (req, res) => {
    try {
      const response = await usersFactory.getFollowers({
        ...req.body,
        ...req.query,
        ...req.params,
        userId: req.userId,
      });
      return res.status(200).json(response);
    } catch (err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
  getSavedLivesUser: async (req, res) => {
    try {
      const response = await usersFactory.getSavedLivesUser({
        ...req.body,
        ...req.query,
        ...req.params,
        userId: req.userId,
      });
      return res.status(200).json(response);
    } catch (err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
  getFollowingsLivesUser: async (req, res) => {
    try {
      const response = await usersFactory.getFollowingsLivesUser({
        ...req.body,
        ...req.query,
        ...req.params,
        userId: req.userId,
      });
      return res.status(200).json(response);
    } catch (err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
};

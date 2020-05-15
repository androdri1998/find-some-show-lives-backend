const livesFactory = require("../factories/lives.factory");
const { switchError } = require("../services/application.service");

module.exports = {
  createLive: async (req, res) => {
    try {
      const response = await livesFactory.createLiveFactory({
        ...req.body,
        ...req.query,
        ...req.params,
        userDecoded: req.userDecoded,
      });
      return res.status(201).json(response);
    } catch (err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
  getLives: async (req, res) => {
    try {
      const response = await livesFactory.getLivesFactory({
        ...req.body,
        ...req.query,
        ...req.params,
        userDecoded: req.userDecoded,
      });
      return res.status(200).json(response);
    } catch (err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
  deleteLive: async (req, res) => {
    try {
      const response = await livesFactory.deleteLiveFactory({
        ...req.body,
        ...req.query,
        ...req.params,
        userDecoded: req.userDecoded,
      });
      return res.status(200).json(response);
    } catch (err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
  getLivesUser: async (req, res) => {
    try {
      const response = await livesFactory.getLivesUserFactory({
        ...req.body,
        ...req.query,
        ...req.params,
        userDecoded: req.userDecoded,
      });
      return res.status(200).json(response);
    } catch (err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
  saveLive: async (req, res) => {
    try {
      const response = await livesFactory.saveLiveFactory({
        ...req.body,
        ...req.query,
        ...req.params,
        userDecoded: req.userDecoded,
      });
      return res.status(201).json(response);
    } catch (err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
  unsaveLive: async (req, res) => {
    try {
      const response = await livesFactory.unsaveLiveFactory({
        ...req.body,
        ...req.query,
        ...req.params,
        userDecoded: req.userDecoded,
      });
      return res.status(200).json(response);
    } catch (err) {
      const [status, error] = switchError(err);
      return res.status(status).json(error);
    }
  },
};

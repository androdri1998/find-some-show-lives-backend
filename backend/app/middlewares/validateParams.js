const applicationService = require('../services/application.service');

module.exports = ( schema, scope ) => async (req, res, next) => {
  try {
    await schema[scope].validateAsync(req[scope]);
    return next();
  } catch (err) {
    const [status, error] = applicationService.switchError(err);
    return res.status(status).json(error);
  }
}
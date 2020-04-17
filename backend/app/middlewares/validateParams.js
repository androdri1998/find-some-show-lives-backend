const applicationService = require('../services/application.service');
const { CustomBadRequestError } = require('../utils/Errors');

module.exports = ( schema, scope ) => async (req, res, next) => {
  try {
    await schema[scope].validateAsync(req[scope]);
    return next();
  } catch (err) {
    const customError = new CustomBadRequestError(err.message);
    const [status, error] = applicationService.switchError(customError);
    return res.status(status).json(error);
  }
}
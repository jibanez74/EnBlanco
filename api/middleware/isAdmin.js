const ErrorResponse = require('../services/ErrorResponse');

module.exports = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    console.error('not an admin');
    return next(new ErrorResponse('Acceso denegado', 401));
  }

  next();
};

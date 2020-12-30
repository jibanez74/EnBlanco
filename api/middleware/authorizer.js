const jwt = require('jsonwebtoken');
const ErrorResponse = require('../services/ErrorResponse');
const User = require('../models/UserModel');
const { jwtSecret } = require('../config/keys');

module.exports = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Acceso Denegado', 401));
  }

  try {
    // verify validity of token
    const decodedToken = jwt.verify(token, jwtSecret);

    // get id from jwt
    const userId = decodedToken.id;

    // get full user and store it inside the request
    req.user = await User.findById(userId);

    next();
  } catch (error) {
    return next(new ErrorResponse('Acceso Denegado', 401));
  }
};

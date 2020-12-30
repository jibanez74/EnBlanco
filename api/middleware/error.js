const ErrorResponse = require('../services/ErrorResponse');

// global error middleware
module.exports = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // log to console during development
  if (process.env.NODE_ENV === 'development') {
    console.error(`An error occurred \n ${error.message}`);
  }

  // an error with the mongoose _id
  if (err.name === 'CastError') {
    const message =
      'Error!  Either the mongo id was not formatted correctly or no resources were found with the specifyed id!';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 422);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
  });
};

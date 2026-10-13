const multer = require('multer');
const { createHttpError } = require('../utils');

function notFoundHandler(req, res, next) {
  next(createHttpError(404, 'Route not found.'));
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error);
    return;
  }

  const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
  if (statusCode >= 500) {
    console.error('API request failed:', error);
  }

  const message = statusCode >= 500
    ? 'An unexpected server error occurred.'
    : error.message;

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && error instanceof multer.MulterError
      ? { code: error.code }
      : {}),
  });
}

module.exports = { errorHandler, notFoundHandler };

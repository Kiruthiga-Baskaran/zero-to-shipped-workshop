const mongoose = require('mongoose');

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function asyncHandler(handler) {
  return function handleAsyncRoute(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function isPdfBuffer(buffer) {
  return Buffer.isBuffer(buffer)
    && buffer.length >= 5
    && buffer.subarray(0, 5).toString('ascii') === '%PDF-';
}

function isValidObjectId(value) {
  return mongoose.isValidObjectId(value);
}

module.exports = {
  asyncHandler,
  createHttpError,
  isPdfBuffer,
  isValidObjectId,
};

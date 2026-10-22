import { ApiError } from '../utils/ApiError.js';

export const notFound = (req, _res, next) => next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
export const errorHandler = (error, _req, res, _next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';
  let details = error.details || undefined;
  if (error.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Request body contains invalid JSON';
  } else if (error.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request body is too large';
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.values(error.errors).map(({ path, message: itemMessage }) => ({ field: path, message: itemMessage }));
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource id';
  } else if (error.code === 11000) {
    statusCode = 409;
    message = 'A record with this value already exists';
  } else if (statusCode >= 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal server error';
    details = undefined;
  }
  const body = { success: false, message };
  if (details) body.errors = details;
  if (process.env.NODE_ENV !== 'production' && error.stack) body.stack = error.stack;
  res.status(statusCode).json(body);
};

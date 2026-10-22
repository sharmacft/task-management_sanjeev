import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) throw new ApiError(401, 'Authentication token is required');
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'task-management-api' });
  } catch {
    throw new ApiError(401, 'Invalid or expired authentication token');
  }
  const user = await User.findById(payload.sub);
  if (!user) throw new ApiError(401, 'User account was not found');
  req.user = user;
  next();
});

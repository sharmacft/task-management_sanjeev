import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';

const tokenFor = (user) => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters');
  return jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d', issuer: 'task-management-api' });
};
const profile = (user) => ({ id: user.id, name: user.name, email: user.email, createdAt: user.createdAt });

export const registerUser = async ({ name, email, password }) => {
  try {
    const user = await User.create({ name, email, password });
    return { user: profile(user), token: tokenFor(user) };
  } catch (error) {
    if (error.code === 11000) throw new ApiError(409, 'An account with this email already exists');
    throw error;
  }
};
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Invalid email or password');
  return { user: profile(user), token: tokenFor(user) };
};
export const getProfile = (user) => profile(user);

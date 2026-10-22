import { registerUser, loginUser, getProfile } from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';
export const register = async (req, res) => sendSuccess(res, { statusCode: 201, message: 'User registered successfully', data: await registerUser(req.body) });
export const login = async (req, res) => sendSuccess(res, { message: 'Login successful', data: await loginUser(req.body) });
export const me = async (req, res) => sendSuccess(res, { message: 'Profile retrieved successfully', data: getProfile(req.user) });

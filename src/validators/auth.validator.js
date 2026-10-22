import Joi from 'joi';
const email = Joi.string().trim().lowercase().email({ tlds: { allow: false } }).max(254).required();
export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email,
  password: Joi.string().min(8).max(72).required().messages({ 'string.min': 'Password must be at least 8 characters', 'string.max': 'Password cannot exceed 72 characters' }),
}).required();
export const loginSchema = Joi.object({ email, password: Joi.string().min(1).max(72).required() }).required();

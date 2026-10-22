import { ApiError } from '../utils/ApiError.js';
export const validate = (schema, property = 'body') => (req, _res, next) => {
  const { error, value } = schema.validate(req[property], { abortEarly: false, convert: true, stripUnknown: false });
  if (error) return next(new ApiError(400, 'Validation failed', error.details.map((item) => ({ field: item.path.join('.'), message: item.message }))));
  if (property === 'query') req.validatedQuery = value;
  else req[property] = value;
  next();
};

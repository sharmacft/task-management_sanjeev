import Joi from 'joi';
const taskFields = {
  title: Joi.string().trim().min(1).max(160),
  description: Joi.string().trim().max(5000).allow(''),
  priority: Joi.string().valid('low', 'medium', 'high'),
  status: Joi.string().valid('pending', 'in-progress', 'completed'),
  dueDate: Joi.date().iso().allow(null),
};
export const createTaskSchema = Joi.object({ ...taskFields, title: taskFields.title.required() }).unknown(false).required();
export const updateTaskSchema = Joi.object(taskFields).min(1).unknown(false).required();
export const listTasksSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('pending', 'in-progress', 'completed'),
  search: Joi.string().trim().max(100),
  sort: Joi.string().valid('createdAt', 'dueDate').default('createdAt'),
}).unknown(false);

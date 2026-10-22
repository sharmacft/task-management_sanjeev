import * as tasks from '../services/task.service.js';
import { sendSuccess } from '../utils/response.js';
export const create = async (req, res) => sendSuccess(res, { statusCode: 201, message: 'Task created successfully', data: await tasks.createTask(req.body, req.user.id) });
export const list = async (req, res) => { const result = await tasks.listTasks(req.user.id, req.validatedQuery); return sendSuccess(res, { message: 'Tasks retrieved successfully', data: result.tasks, meta: result.meta }); };
export const get = async (req, res) => sendSuccess(res, { message: 'Task retrieved successfully', data: await tasks.getTask(req.params.id, req.user.id) });
export const update = async (req, res) => sendSuccess(res, { message: 'Task updated successfully', data: await tasks.updateTask(req.params.id, req.user.id, req.body) });
export const remove = async (req, res) => { await tasks.deleteTask(req.params.id, req.user.id); return sendSuccess(res, { message: 'Task deleted successfully', data: null }); };

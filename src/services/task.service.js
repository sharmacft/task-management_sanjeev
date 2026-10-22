import mongoose from 'mongoose';
import { Task } from '../models/task.model.js';
import { ApiError } from '../utils/ApiError.js';

const ownedTask = async (id, owner) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Invalid task id');
  const task = await Task.findOne({ _id: id, owner });
  if (!task) throw new ApiError(404, 'Task not found');
  return task;
};
export const createTask = (data, owner) => Task.create({ ...data, owner });
export const listTasks = async (owner, query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const filter = { owner };
  if (query.status) filter.status = query.status;
  if (query.search) filter.$or = [
    { title: { $regex: escapeRegex(query.search), $options: 'i' } },
    { description: { $regex: escapeRegex(query.search), $options: 'i' } },
  ];
  const [tasks, total] = await Promise.all([
    Task.find(filter).sort(query.sort === 'dueDate' ? { dueDate: 1, createdAt: -1 } : { createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Task.countDocuments(filter),
  ]);
  return { tasks, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
};
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const getTask = (id, owner) => ownedTask(id, owner);
export const updateTask = async (id, owner, data) => {
  const task = await ownedTask(id, owner);
  Object.assign(task, data);
  return task.save();
};
export const deleteTask = async (id, owner) => { const task = await ownedTask(id, owner); await task.deleteOne(); };

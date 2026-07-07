import mongoose from "mongoose";
import Task from "../models/Task.js";

const sanitizeSubTasks = (subTasks) => {
  if (!Array.isArray(subTasks)) return undefined;

  return subTasks
    .filter(Boolean)
    .map((subTask) => {
      const normalized = {
        text: typeof subTask?.text === "string" ? subTask.text.trim() : "",
        completed: Boolean(subTask?.completed),
      };

      const candidateId = subTask?._id;
      if (
        (typeof candidateId === "string" && mongoose.Types.ObjectId.isValid(candidateId)) ||
        candidateId instanceof mongoose.Types.ObjectId
      ) {
        normalized._id = candidateId;
      }

      return normalized;
    })
    .filter((subTask) => subTask.text.length > 0);
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, deadline, status, category, subTasks } = req.body;
    const sanitizedSubTasks = sanitizeSubTasks(subTasks);

    const task = await Task.create({
      title,
      description,
      deadline,
      status,
      category,
      ...(sanitizedSubTasks !== undefined ? { subTasks: sanitizedSubTasks } : {}),
      user: req.user.id,
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { title, description, deadline, status, category, subTasks } = req.body;
    const sanitizedSubTasks = sanitizeSubTasks(subTasks);
    const updatePayload = {
      title,
      description,
      deadline,
      status,
      category,
      ...(sanitizedSubTasks !== undefined ? { subTasks: sanitizedSubTasks } : {}),
    };

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updatePayload,
      { returnDocument: 'after', runValidators: true, omitUndefined: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted", id: req.params.id });
  } catch (err) {
    next(err);
  }
};

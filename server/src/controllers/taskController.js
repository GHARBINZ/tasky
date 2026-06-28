import Task from "../models/Task.js";

export const createTask = async (req, res, next) => {
  try {
    const { title, description, deadline, status } = req.body;
    const task = await Task.create({
      title,
      description,
      deadline,
      status,
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
    const { title, description, deadline, status } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, description, deadline, status },
      { new: true, runValidators: true, omitUndefined: true }
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

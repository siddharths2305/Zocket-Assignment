const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Create Task
router.post("/", authMiddleware, async (req, res) => {
  const task = new Task({ ...req.body });
  await task.save();
  res.json(task);
});

// Get Tasks
router.get("/", authMiddleware, async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Update Task
router.put("/:id", authMiddleware, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

// Delete Task
router.delete("/:id", authMiddleware, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

module.exports = router;

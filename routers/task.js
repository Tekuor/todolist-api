const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/tasks", auth, async (req, res) => {
  try {
    const data = Object.assign(req.body, { userId: req.user._id });
    const task = await Task.create(data);
    res.status(201).send({ task });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/tasks/:task_id", auth, async (req, res) => {
  try {
    const taskId = req.params.task_id;
    const updates = req.body;
    const task = await Task.findByIdAndUpdate(taskId, updates);
    res.status(201).send({ task });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks/:task_id", auth, async (req, res) => {
  try {
    const taskId = req.params.task_id;
    const task = await Task.findById(taskId);
    if (task) {
      res.status(200).send({ task });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ userId }).populate("category");
    const totalTasks = await Task.countDocuments({ userId });
    const progressTasks = await Task.countDocuments({
      userId,
      status: "In-progress",
    });
    const completedTasks = await Task.countDocuments({
      userId,
      status: "Completed",
    });
    if (tasks) {
      res
        .status(200)
        .send({ tasks, totalTasks, progressTasks, completedTasks });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:task_id", auth, async (req, res) => {
  try {
    const taskId = req.params.task_id;
    await Task.findByIdAndDelete(taskId);
    res.status(200).send({});
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;

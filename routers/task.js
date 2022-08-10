const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const dateFns = require("date-fns");
const rRule = require("rrule");

const router = express.Router();

router.post("/tasks", auth, async (req, res) => {
  try {
    const data = Object.assign(req.body, { userId: req.user._id });
    if (data.frequency !== "once") {
      let frequency = "";
      switch (data.frequency) {
        case "daily":
          frequency = rRule.RRule.DAILY;
          break;
        case "weekly":
          frequency = rRule.RRule.WEEKLY;
          break;
        case "monthly":
          frequency = rRule.RRule.MONTHLY;
          break;
        case "yearly":
          frequency = rRule.RRule.YEARLY;
          break;
      }

      const rule = new rRule.RRule({
        freq: frequency,
        interval: 1,
        wkst: rRule.RRule.MO,
        dtstart: new Date(data.dueDate),
        until: dateFns.addMonths(new Date(data.dueDate), 2),
      });

      const dates = rule.all();
      for (const taskDate of dates) {
        data.dueDate = taskDate;
        await Task.create(data);
      }
    } else {
      await Task.create(data);
    }

    res.status(201).send({});
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

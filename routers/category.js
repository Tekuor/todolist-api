const express = require("express");
const Category = require("../models/category");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/categories", auth, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).send({ category });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/categories/:category_id", auth, async (req, res) => {
  try {
    const taskId = req.params.category_id;
    const updates = req.body;
    const category = await Category.findByIdAndUpdate(taskId, updates);
    res.status(201).send({ category });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/categories/:category_id", auth, async (req, res) => {
  try {
    const taskId = req.params.category_id;
    const category = await Category.findById(taskId);
    if (category) {
      res.status(200).send({ category });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/categories", auth, async (req, res) => {
  try {
    const categories = await Category.find({});
    if (categories) {
      res.status(200).send({ categories });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/categories/:category_id", auth, async (req, res) => {
  try {
    const taskId = req.params.category_id;
    await Category.findByIdAndDelete(taskId);
    res.status(200).send({});
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;

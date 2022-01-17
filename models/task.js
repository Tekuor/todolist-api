const mongoose = require("mongoose");
const validator = require("validator");

const taskSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    default: "In-progress",
  },
  frequency: {
    type: String,
    required: true,
    default: "",
  },
  priority: {
    type: String,
    required: false,
    default: "",
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  createdDate: { type: Date, default: Date.now() },
});

taskSchema.set("toObject", { virtuals: true });
taskSchema.set("toJSON", { virtuals: true });

taskSchema.virtual("category", {
  ref: "Category",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true,
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;

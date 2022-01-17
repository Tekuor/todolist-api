const mongoose = require("mongoose");
const validator = require("validator");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  color: {
    type: String,
    required: false,
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;

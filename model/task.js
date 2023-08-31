const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
    unique: true,
  },
  done: {
    type: Boolean,
    required: true,
  },
});

const task = new mongoose.model("task", taskSchema);
module.exports = task;

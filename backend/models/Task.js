const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },

  // 🔥 DEADLINE
  dueDate: {
    type: Date,
    required: true
  },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  // 🔥 PROGRESS %
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }

}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
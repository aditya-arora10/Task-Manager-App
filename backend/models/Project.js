const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: String,

  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  // 🔥 THIS WAS YOUR MAIN BUG
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Project", ProjectSchema);
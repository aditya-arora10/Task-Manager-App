const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,

  // 🔥 TEAM SYSTEM
  teamCode: String, // admin creates this
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("User", userSchema);
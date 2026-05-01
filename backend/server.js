const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/users", require("./routes/users"));

app.get("/reset-all", async (req, res) => {
  try {
    const User = require("./models/User");
    const Project = require("./models/Project");
    const Task = require("./models/Task");

    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    res.send("🔥 ALL DATA RESET (Users, Projects, Tasks)");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error resetting DB");
  }
});

// ✅ Serve frontend (Vite dist)
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ❗ FIXED PORT (IMPORTANT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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

app.listen(5000, ()=>console.log("Server running on port 5000"));
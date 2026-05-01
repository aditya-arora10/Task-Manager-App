const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto"); // ✅ FIX
global.crypto = crypto; // ✅ FIX
require("dotenv").config();

const app = express();

// ✅ CORS (allow Vercel frontend)
app.use(cors({
  origin: "https://task-manager-app-zeta-rosy.vercel.app",
  credentials: true
}));

app.use(express.json());

// ✅ MongoDB (with better config)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => {
  console.log("❌ Mongo Error:", err.message);
});

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/users", require("./routes/users"));

// ✅ RESET (optional)
app.get("/reset-all", async (req, res) => {
  try {
    const User = require("./models/User");
    const Project = require("./models/Project");
    const Task = require("./models/Task");

    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    res.send("🔥 ALL DATA RESET");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error resetting DB" });
  }
});

// ❌ REMOVE THIS (causes error in Railway)
// app.use(express.static(path.join(__dirname, "dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

// ✅ PORT FIX
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
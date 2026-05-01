const router = require("express").Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// 🧠 Team helper (SAFE)
const getTeamId = (user) => {
  return user.role === "Admin"
    ? user._id
    : user.createdBy;
};


// ✅ CREATE TASK
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json("Only Admin can assign tasks");
    }

    const { title, assignedTo, project, dueDate } = req.body;

    if (!title || !assignedTo || !project || !dueDate) {
      return res.status(400).json("All fields including deadline required");
    }

    const task = await Task.create({
      title,
      assignedTo,
      project,
      dueDate,
      team: getTeamId(req.user),
      progress: 0
    });

    res.json(task);

  } catch (err) {
    console.log(err);
    res.status(500).json("Error creating task");
  }
});


// ✅ GET TASKS (TEAM BASED + HIDE EXPIRED)
router.get("/", auth, async (req, res) => {
  try {
    const now = new Date();

    let filter = {
      team: getTeamId(req.user),
      dueDate: { $gte: now }
    };

    if (req.user.role === "Member") {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("project", "name");

    res.json(tasks);

  } catch (err) {
    res.status(500).json("Error fetching tasks");
  }
});


// ✅ ADMIN ALL TASKS
router.get("/all", auth, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json("Access denied");
    }

    const now = new Date();

    const tasks = await Task.find({
      team: getTeamId(req.user),
      dueDate: { $gte: now }
    })
      .populate("assignedTo", "name email")
      .populate("project", "name");

    res.json(tasks);

  } catch {
    res.status(500).json("Error fetching tasks");
  }
});


// ✅ UPDATE PROGRESS
router.put("/progress/:id", auth, async (req, res) => {
  try {
    const { progress } = req.body;

    if (progress < 0 || progress > 100) {
      return res.status(400).json("Progress must be 0-100");
    }

    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json("Task not found");

    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json("Not allowed");
    }

    task.progress = progress;
    await task.save();

    res.json(task);

  } catch {
    res.status(500).json("Error updating progress");
  }
});


// 🏆 LEADERBOARD
router.get("/leaderboard", auth, async (req, res) => {
  try {
    const teamId = getTeamId(req.user);

    const tasks = await Task.find({ team: teamId })
      .populate("assignedTo", "name");

    const now = new Date();
    const stats = {};

    tasks.forEach(task => {
      const id = task.assignedTo?._id?.toString();
      const name = task.assignedTo?.name || "Unknown";

      if (!id) return;

      if (!stats[id]) {
        stats[id] = {
          name,
          completed: 0,
          pending: 0,
          overdue: 0,
          score: 0
        };
      }

      if (task.progress === 100) {
        stats[id].completed++;
      } else if (new Date(task.dueDate) < now) {
        stats[id].overdue++;
      } else {
        stats[id].pending++;
      }
    });

    Object.values(stats).forEach(m => {
      m.score =
        m.completed * 5 -
        m.pending * 2 -
        m.overdue * 3;
    });

    const leaderboard = Object.values(stats).sort(
      (a, b) => b.score - a.score
    );

    res.json(leaderboard);

  } catch (err) {
    console.log(err);
    res.status(500).json("Leaderboard error");
  }
});

module.exports = router;
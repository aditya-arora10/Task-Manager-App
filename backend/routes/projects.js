const router = require("express").Router();
const Project = require("../models/Project");
const auth = require("../middleware/auth");


// 🧠 Helper → Get Team ID
const getTeamId = (user) => {
  if (user.role === "Admin") return user._id;
  return user.createdBy;
};


// ✅ CREATE PROJECT
router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json("Project name is required");
    }

    const teamId = getTeamId(req.user);

    if (!teamId) {
      return res.status(400).json("Invalid team");
    }

    const project = await Project.create({
      name: name.trim(),
      members: [req.user._id],
      createdBy: req.user._id,
      team: teamId
    });

    console.log("✅ PROJECT CREATED:", project);

    res.json(project);

  } catch (err) {
    console.log("❌ CREATE PROJECT ERROR:", err);
    res.status(500).json(err.message || "Error creating project");
  }
});


// ✅ GET PROJECTS
router.get("/", auth, async (req, res) => {
  try {
    const teamId = getTeamId(req.user);

    if (!teamId) {
      return res.status(400).json("Invalid team");
    }

    const projects = await Project.find({ team: teamId })
      .populate("members", "name email");

    console.log("✅ PROJECTS FOUND:", projects.length);

    res.json(projects);

  } catch (err) {
    console.log("❌ FETCH PROJECT ERROR:", err);
    res.status(500).json("Error fetching projects");
  }
});


// ✅ DELETE PROJECT (ADMIN ONLY)
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json("Only Admin allowed");
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json("Project not found");
    }

    const teamId = getTeamId(req.user);

    if (project.team.toString() !== teamId.toString()) {
      return res.status(403).json("Not your team");
    }

    await project.deleteOne();

    res.json("Project deleted");

  } catch (err) {
    console.log("❌ DELETE PROJECT ERROR:", err);
    res.status(500).json("Error deleting project");
  }
});
router.get("/clear", async (req, res) => {
  await Project.deleteMany({});
  res.send("Deleted");
});

module.exports = router;
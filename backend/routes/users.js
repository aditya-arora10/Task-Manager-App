const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// GET ALL MEMBERS ONLY
router.get("/members", auth, async (req, res) => {
  try {
    const users = await User.find({ role: "Member" }).select("name email");
    res.json(users);
  } catch (err) {
    res.status(500).json("Error fetching members");
  }
});

module.exports = router;
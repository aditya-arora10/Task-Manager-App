const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// ✅ SIGNUP
router.post("/signup", async (req, res) => {
  try {
    let { name, email, password, role, adminSecret, teamCode } = req.body;

    name = name?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    let userRole = role === "Admin" ? "Admin" : "Member";
    let createdBy = null;
    let generatedTeamCode = null;

    // 👨‍💼 ADMIN
    if (userRole === "Admin") {
      if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: "Invalid admin secret" });
      }

      generatedTeamCode = crypto.randomBytes(3).toString("hex");
    }

    // 👤 MEMBER
    if (userRole === "Member") {
      if (!teamCode) {
        return res.status(400).json({ message: "Team code is required" });
      }

      const admin = await User.findOne({
        teamCode: teamCode.trim(),
        role: "Admin"
      });

      if (!admin) {
        return res.status(400).json({ message: "Invalid team code" });
      }

      const count = await User.countDocuments({
        createdBy: admin._id
      });

      if (count >= 4) {
        return res.status(400).json({ message: "Team full (max 4)" });
      }

      createdBy = admin._id;
      generatedTeamCode = admin.teamCode;
    }

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: userRole,
      teamCode: generatedTeamCode,
      createdBy
    });

    res.json({ message: "Signup successful", user });

  } catch (err) {
    console.log("❌ SIGNUP ERROR:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET
    );

    res.json({ token, user });

  } catch (err) {
    console.log("❌ LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

// ⚠️ OPTIONAL CLEAR USERS
router.get("/clear-users", async (req, res) => {
  try {
    await User.deleteMany({});
    res.send("All users deleted");
  } catch (err) {
    res.status(500).json({ message: "Error deleting users" });
  }
});

module.exports = router;
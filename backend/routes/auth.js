const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


// ✅ SIGNUP
router.post("/signup", async (req, res) => {
  try {
    let { name, email, password, role, adminSecret, teamCode } = req.body;

    // 🔥 TRIM INPUTS (IMPORTANT)
    name = name?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!name || !email || !password) {
      return res.status(400).json("All fields are required");
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json("User already exists");

    const hashed = await bcrypt.hash(password, 10);

    let userRole = role === "Admin" ? "Admin" : "Member";
    let createdBy = null;
    let generatedTeamCode = null;

    // 👨‍💼 ADMIN
    if (userRole === "Admin") {
      if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json("Invalid admin secret");
      }

      generatedTeamCode = crypto.randomBytes(3).toString("hex");
    }

    // 👤 MEMBER
    if (userRole === "Member") {
      if (!teamCode) {
        return res.status(400).json("Team code is required");
      }

      const admin = await User.findOne({
        teamCode: teamCode.trim(),
        role: "Admin"
      });

      if (!admin) {
        return res.status(400).json("Invalid team code");
      }

      const count = await User.countDocuments({
        createdBy: admin._id
      });

      if (count >= 4) {
        return res.status(400).json("Team full (max 4)");
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
    res.status(500).json("Signup failed");
  }
});


// ✅ LOGIN (UPDATED + DEBUG)
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    // 🔥 TRIM INPUTS
    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json("Email and password required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ USER NOT FOUND:", email);
      return res.status(400).json("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("LOGIN DEBUG:", {
      email,
      enteredPassword: password,
      storedHash: user.password,
      match: isMatch
    });

    if (!isMatch) {
      return res.status(400).json("Invalid credentials");
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
    res.status(500).json("Login failed");
  }
});

// ⚠️ TEMP: DELETE ALL USERS (USE ONCE)
router.get("/clear-users", async (req, res) => {
  try {
    await User.deleteMany({});
    res.send("All users deleted");
  } catch (err) {
    res.status(500).json("Error deleting users");
  }
});
module.exports = router;
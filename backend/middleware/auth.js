const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) return res.status(401).json("No token");

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(verified.id);

    if (!user) return res.status(404).json("User not found");

    req.user = user;

    next();

  } catch (err) {
    res.status(400).json("Invalid token");
  }
};
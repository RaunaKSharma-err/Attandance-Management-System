const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { signToken } = require("../services/tokenService");

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, rollNumber } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "name, email, password are required" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Email already in use" });
  }

  // Validate role
  const allowedRoles = ["student", "teacher", "admin"];
  const userRole = allowedRoles.includes(role) ? role : "student";

  const user = await User.create({
    name,
    email,
    password,
    rollNumber: userRole === "student" ? rollNumber || null : null,
    role: userRole,
  });

  const token = signToken({ id: user._id, role: user.role });
  return res.status(201).json({ user, token });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({ id: user._id, role: user.role });
  return res.status(200).json({ user, token });
});

module.exports = { register, login };

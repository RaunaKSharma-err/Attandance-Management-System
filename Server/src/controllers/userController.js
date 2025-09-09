const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json({ user: req.user });
});

// List students only (teacher/admin)
const listStudents = asyncHandler(async (req, res) => {
  const students = await User.find({ role: "student" }).select(
    "_id name email role rollNumber createdAt"
  );
  return res.status(200).json({ students });
});

module.exports = { getMe, listStudents };

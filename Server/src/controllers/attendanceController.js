const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const User = require("../models/User");

// Normalize date to midnight UTC for consistent per-day records
function normalizeDate(dateStrOrDate) {
  const d =
    dateStrOrDate instanceof Date ? dateStrOrDate : new Date(dateStrOrDate);
  const normalized = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  );
  return normalized;
}

// POST /api/attendance/mark
const markAttendance = asyncHandler(async (req, res) => {
  const { studentId, date, status } = req.body;

  if (!studentId || !date || !status) {
    return res
      .status(400)
      .json({ message: "studentId, date (YYYY-MM-DD), status are required" });
  }
  if (!["present", "absent"].includes(status)) {
    return res
      .status(400)
      .json({ message: "status must be present or absent" });
  }
  if (!mongoose.isValidObjectId(studentId)) {
    return res.status(400).json({ message: "Invalid studentId" });
  }

  const student = await User.findById(studentId);
  if (!student || student.role !== "student") {
    return res.status(404).json({ message: "Student not found" });
  }

  const normalizedDate = normalizeDate(date);

  const record = await Attendance.findOneAndUpdate(
    { studentId, date: normalizedDate },
    { $set: { status, markedBy: req.user._id } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return res.status(200).json({ attendance: record });
});

// GET /api/attendance/student/:id
const getStudentAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid student id" });
  }

  const student = await User.findById(id);
  if (!student || student.role !== "student") {
    return res.status(404).json({ message: "Student not found" });
  }

  const records = await Attendance.find({ studentId: id }).sort({ date: 1 });
  return res.status(200).json({ records });
});

// GET /api/attendance/date/:date (teacher/admin)
const getAttendanceByDate = asyncHandler(async (req, res) => {
  const { date } = req.params;
  const normalizedDate = normalizeDate(date);
  const records = await Attendance.find({ date: normalizedDate })
    .populate("studentId", "name email rollNumber")
    .populate("markedBy", "name email role");
  return res.status(200).json({ records });
});

// GET /api/attendance/summary/:id
const getStudentSummary = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid student id" });
  }

  const student = await User.findById(id);
  if (!student || student.role !== "student") {
    return res.status(404).json({ message: "Student not found" });
  }

  const records = await Attendance.find({ studentId: id });
  const total = records.length;
  const present = records.filter((r) => r.status === "present").length;
  const percentage =
    total === 0 ? 0 : Math.round((present / total) * 10000) / 100; // 2 decimals

  return res.status(200).json({
    student: {
      id: student._id,
      name: student.name,
      rollNumber: student.rollNumber,
    },
    totalDays: total,
    presentDays: present,
    absentDays: total - present,
    percentage,
  });
});

// POST /api/iot/attendance
const markAttendanceFromIoT = asyncHandler(async (req, res) => {
  const { rfid } = req.body;
  if (!rfid) return res.status(400).json({ message: "RFID tag required" });

  const student = await User.findOne({ rfidTag: rfid });
  if (!student) {
    return res
      .status(404)
      .json({ message: "Student not registered with this RFID" });
  }

  const today = normalizeDate(new Date());

  const record = await Attendance.findOneAndUpdate(
    { studentId: student._id, date: today },
    {
      $set: { status: "present", markedBy: student._id, markedAt: new Date() },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return res.status(200).json({
    message: "Attendance marked successfully via IoT",
    attendance: record,
  });
});

// POST /api/users/:id/assign-rfid
const assignRFID = asyncHandler(async (req, res) => {
  const { rfid } = req.body;
  const { id } = req.params;

  if (!rfid) return res.status(400).json({ message: "RFID required" });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ message: "Invalid ID" });

  const user = await User.findById(id);
  if (!user || user.role !== "student") {
    return res.status(404).json({ message: "Student not found" });
  }

  user.rfidTag = rfid;
  await user.save();

  return res.status(200).json({ message: "RFID assigned", student: user });
});

module.exports = {
  markAttendance,
  getStudentAttendance,
  getAttendanceByDate,
  getStudentSummary,
  markAttendanceFromIoT,
  assignRFID,
};

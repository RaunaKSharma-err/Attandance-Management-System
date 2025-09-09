const express = require("express");
const {
  markAttendance,
  getStudentAttendance,
  getAttendanceByDate,
  getStudentSummary,
} = require("../controllers/attendanceController");
const { protect } = require("../middlewares/auth");
const { requireRole } = require("../middlewares/roles");

const router = express.Router();

router.post("/mark", protect, requireRole("teacher", "admin"), markAttendance);
router.get("/student/:id", protect, getStudentAttendance);
router.get(
  "/date/:date",
  protect,
  requireRole("teacher", "admin"),
  getAttendanceByDate
);
router.get("/summary/:id", protect, getStudentSummary);

module.exports = router;

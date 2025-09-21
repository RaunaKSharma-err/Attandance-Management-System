const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const attendanceRoutes = require("./attendanceRoutes");
const deviceRoutes = require("./deviceRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/device", deviceRoutes);

module.exports = router;

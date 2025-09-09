const express = require("express");
const { getMe, listStudents } = require("../controllers/userController");
const { protect } = require("../middlewares/auth");
const { requireRole } = require("../middlewares/roles");

const router = express.Router();

router.get("/me", protect, getMe);
router.get("/", protect, requireRole("teacher", "admin"), listStudents);

module.exports = router;

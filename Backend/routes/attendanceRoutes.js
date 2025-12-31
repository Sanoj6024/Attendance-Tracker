const express = require("express");
const {
  markAttendance,
  getStudentAttendance
} = require("../controllers/attendanceController");

const { protect } = require("../middleware/authMiddleware");
const { teacherOnly, studentOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

// Teacher marks attendance
router.post("/", protect, teacherOnly, markAttendance);

// Student views attendance
router.get("/student", protect, studentOnly, getStudentAttendance);

module.exports = router;

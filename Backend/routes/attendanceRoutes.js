const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");

const { teacherOnly, studentOnly } = require("../middleware/roleMiddleware");
const {
  markAttendance,
  getStudentAttendance,
} = require("../controllers/attendanceController");

router.post("/mark", authMiddleware, teacherOnly, markAttendance);
router.get("/student", authMiddleware, studentOnly, getStudentAttendance);

module.exports = router;

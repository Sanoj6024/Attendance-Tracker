const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { teacherOnly } = require("../middleware/roleMiddleware");

const {
  markAttendance,
  getStudentAttendance,
  getSubjectAttendanceStats,
} = require("../controllers/attendanceController");

router.post("/mark", auth, teacherOnly, markAttendance);
router.get("/student", auth, getStudentAttendance);

// 🆕 Teacher → cumulative subject stats (multi-teacher)
router.get(
  "/subject/:subjectId/stats",
  auth,
  teacherOnly,
  getSubjectAttendanceStats
);

module.exports = router;

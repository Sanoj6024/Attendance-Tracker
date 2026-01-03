const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { teacherOnly } = require("../middleware/roleMiddleware");

const {
  markAttendance,
  getStudentAttendance,
  getAttendanceBySubject,
} = require("../controllers/attendanceController");

router.post("/mark", auth, teacherOnly, markAttendance);
router.get("/student", auth, getStudentAttendance);
router.get("/subject/:subjectId", auth, teacherOnly, getAttendanceBySubject);

module.exports = router;

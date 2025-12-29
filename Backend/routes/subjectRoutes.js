const express = require("express");
const { createSubject, getMySubjects, getStudentSubjects } = require("../controllers/subjectController");
const { protect } = require("../middleware/authMiddleware");
const { teacherOnly, studentOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

// Teacher creates subject
router.post("/", protect, teacherOnly, createSubject);

// Teacher fetches own subjects
router.get("/teacher", protect, teacherOnly, getMySubjects);

// Student fetches subjects (auto-sync)
router.get("/student", protect, studentOnly, getStudentSubjects);

module.exports = router;

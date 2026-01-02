const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");

const { teacherOnly, studentOnly } = require("../middleware/roleMiddleware");
const {
  createSubject,
  getMySubjects,
  getStudentSubjects,
} = require("../controllers/subjectController");

router.post("/", authMiddleware, teacherOnly, createSubject);
router.get("/teacher", authMiddleware, teacherOnly, getMySubjects);
router.get("/student", authMiddleware, studentOnly, getStudentSubjects);

module.exports = router;

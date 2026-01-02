const express = require("express");
const router = express.Router();

// ✅ IMPORT MIDDLEWARE & CONTROLLER
const auth = require("../middleware/auth");               // auth middleware (NEW FILE)
const { teacherOnly } = require("../middleware/roleMiddleware");
const { getStudents } = require("../controllers/userController");

// ✅ ROUTE DEFINITION
router.get("/students", auth, teacherOnly, getStudents);

// ✅ EXPORT ROUTER
module.exports = router;

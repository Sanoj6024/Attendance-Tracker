const Attendance = require("../models/Attendance");
const Subject = require("../models/Subjects");

/**
 * ================================
 * TEACHER → MARK ATTENDANCE
 * ================================
 * POST /api/attendance/mark
 */
exports.markAttendance = async (req, res) => {
  try {
    const { subjectId, date, attendance } = req.body;
    const teacherId = req.user.id;

    // 🔴 Validation
    if (!subjectId || !date || !attendance || attendance.length === 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    // 🔴 Prevent duplicate attendance for same subject + date
    const alreadyMarked = await Attendance.findOne({
      subject: subjectId,
      date,
    });

    if (alreadyMarked) {
      return res
        .status(400)
        .json({ message: "Attendance already marked for this date" });
    }

    // 🔴 Verify subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // 🔴 Convert request body into DB format
    const records = attendance.map((item) => ({
      student: item.studentId,
      status: item.status,
    }));

    // 🔴 Save attendance
    const newAttendance = new Attendance({
      subject: subjectId,
      teacher: teacherId,
      date,
      records,
    });

    await newAttendance.save();

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance: newAttendance,
    });
  } catch (error) {
    console.error("Mark Attendance Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ================================
 * STUDENT → VIEW ATTENDANCE
 * ================================
 * GET /api/attendance/student
 */
exports.getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;

    const attendance = await Attendance.find({
      "records.student": studentId,
    }).populate("subject", "subjectName");

    res.json(attendance);
  } catch (error) {
    console.error("Student Attendance Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ================================
 * TEACHER → VIEW ATTENDANCE BY SUBJECT
 * ================================
 * GET /api/attendance/subject/:subjectId
 */
exports.getAttendanceBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const attendance = await Attendance.find({ subject: subjectId })
      .populate("records.student", "fullName rollNo")
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    console.error("Subject Attendance Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

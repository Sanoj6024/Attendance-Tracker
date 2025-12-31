const Attendance = require("../models/Attendance");
const User = require("../models/User");
const Subject = require("../models/Subjects"); // or Subject.js (keep consistent)

// 👨‍🏫 TEACHER MARKS ATTENDANCE
exports.markAttendance = async (req, res) => {
  try {
    const { subjectId, date, attendance } = req.body;

    // attendance = [{ studentId, status }]

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Teacher can mark only their subject
    if (subject.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const records = [];

    for (let entry of attendance) {
      records.push({
        student: entry.studentId,
        subject: subjectId,
        date,
        status: entry.status,
      });
    }

    await Attendance.insertMany(records, { ordered: false });

    res.status(201).json({ message: "Attendance marked successfully" });
  } catch (error) {
    // Duplicate attendance safe handling
    if (error.code === 11000) {
      return res.status(400).json({ message: "Attendance already marked for this date" });
    }
    res.status(500).json({ message: error.message });
  }
};

// 👨‍🎓 STUDENT VIEWS ATTENDANCE
exports.getStudentAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user.id })
      .populate("subject", "subjectName")
      .sort({ date: 1 });

    // Calculate summary
    const summary = {};

    records.forEach((rec) => {
      const subject = rec.subject.subjectName;

      if (!summary[subject]) {
        summary[subject] = { total: 0, present: 0 };
      }

      summary[subject].total += 1;
      if (rec.status === "Present") {
        summary[subject].present += 1;
      }
    });

    const result = Object.keys(summary).map((subject) => {
      const { total, present } = summary[subject];
      return {
        subject,
        totalClasses: total,
        present,
        percentage: ((present / total) * 100).toFixed(2),
      };
    });

    res.json({
      attendance: records,
      summary: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

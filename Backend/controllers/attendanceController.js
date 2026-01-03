const Attendance = require("../models/Attendance");
const Subject = require("../models/Subjects");

/**
 * =========================================
 * TEACHER → MARK ATTENDANCE
 * =========================================
 * POST /api/attendance/mark
 */
exports.markAttendance = async (req, res) => {
  try {
    const { subjectId, date, attendance } = req.body;
    const teacherId = req.user.id;

    // ✅ Validation
    if (!subjectId || !date || !attendance || attendance.length === 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    // ✅ Prevent duplicate attendance
    const alreadyMarked = await Attendance.findOne({
      subject: subjectId,
      date,
    });

    if (alreadyMarked) {
      return res
        .status(400)
        .json({ message: "Attendance already marked for this date" });
    }

    // ✅ Verify subject
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // ✅ Format records
    const records = attendance.map((item) => ({
      student: item.studentId,
      status: item.status, // "Present" | "Absent"
    }));

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
 * =========================================
 * STUDENT → VIEW ATTENDANCE (FIXED)
 * =========================================
 * GET /api/attendance/student
 */
exports.getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;

    const attendanceDocs = await Attendance.find({
      "records.student": studentId,
    }).populate("subject", "subjectName");

    const subjectMap = {};

    attendanceDocs.forEach((doc) => {
      if (!doc.subject) return;

      const subjectId = doc.subject._id.toString();

      if (!subjectMap[subjectId]) {
        subjectMap[subjectId] = {
          subjectId,
          subjectName: doc.subject.subjectName,
          totalClasses: 0,
          presentCount: 0,
          presentDates: [],
        };
      }

      const record = doc.records.find(
        (r) => r.student.toString() === studentId.toString()
      );

      if (record) {
        subjectMap[subjectId].totalClasses += 1;

        if (record.status === "Present") {
          subjectMap[subjectId].presentCount += 1;
          subjectMap[subjectId].presentDates.push(doc.date);
        }
      }
    });

    const result = Object.values(subjectMap).map((item) => ({
      subjectId: item.subjectId,
      subjectName: item.subjectName,
      totalClasses: item.totalClasses,
      presentCount: item.presentCount,
      attendance: `${item.presentCount} / ${item.totalClasses}`,
      percentage:
        item.totalClasses === 0
          ? 0
          : Number(
              ((item.presentCount / item.totalClasses) * 100).toFixed(1)
            ),
      presentDates: item.presentDates,
    }));

    res.json(result);
  } catch (error) {
    console.error("Student Attendance Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================================
 * TEACHER → VIEW ATTENDANCE BY SUBJECT
 * =========================================
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

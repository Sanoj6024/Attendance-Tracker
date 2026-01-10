const Attendance = require("../models/Attendance");
const Subject = require("../models/Subjects");

/**
 * =========================================
 * TEACHER → MARK ATTENDANCE
 * =========================================
 */
exports.markAttendance = async (req, res) => {
  try {
    const { subjectId, date, attendance } = req.body;
    const teacherId = req.user.id;

    if (!subjectId || !date || !attendance || attendance.length === 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const alreadyMarked = await Attendance.findOne({ subject: subjectId, date });
    if (alreadyMarked) {
      return res
        .status(400)
        .json({ message: "Attendance already marked for this date" });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const records = attendance.map((item) => ({
      student: item.studentId,
      status: item.status,
    }));

    const newAttendance = new Attendance({
      subject: subjectId,
      teacher: teacherId,
      date,
      records,
    });

    await newAttendance.save();
    res.status(201).json({ message: "Attendance marked successfully" });
  } catch (error) {
    console.error("Mark Attendance Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================================
 * STUDENT → VIEW ATTENDANCE (COMBINED)
 * =========================================
 */
exports.getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;

    const attendanceDocs = await Attendance.find({
      "records.student": studentId,
    })
      .populate("subject", "subjectName batch semester")
      .populate("teacher", "fullName");

    const subjectMap = {};

    attendanceDocs.forEach((doc) => {
      if (!doc.subject || !doc.teacher) return;

      const subjectKey = `${doc.subject.subjectName}-${doc.subject.batch}-${doc.subject.semester}`;

      if (!subjectMap[subjectKey]) {
        subjectMap[subjectKey] = {
          subjectName: doc.subject.subjectName,
          batch: doc.subject.batch,
          semester: doc.subject.semester,
          totalClasses: 0,
          presentCount: 0,
          presentDates: [],
          teachers: {},
        };
      }

      const record = doc.records.find(
        (r) => r.student.toString() === studentId.toString()
      );

      if (!record) return;

      subjectMap[subjectKey].totalClasses += 1;

      const teacherName = doc.teacher.fullName;

      if (!subjectMap[subjectKey].teachers[teacherName]) {
        subjectMap[subjectKey].teachers[teacherName] = {
          teacherName,
          present: 0,
          total: 0,
          presentDates: [],
        };
      }

      subjectMap[subjectKey].teachers[teacherName].total += 1;

      if (record.status === "Present") {
        subjectMap[subjectKey].presentCount += 1;
        subjectMap[subjectKey].teachers[teacherName].present += 1;

        subjectMap[subjectKey].presentDates.push(doc.date);
        subjectMap[subjectKey].teachers[teacherName].presentDates.push(doc.date);
      }
    });

    const result = Object.values(subjectMap).map((subject) => ({
      subjectName: subject.subjectName,
      batch: subject.batch,
      semester: subject.semester,
      totalClasses: subject.totalClasses,
      presentCount: subject.presentCount,
      percentage:
        subject.totalClasses === 0
          ? 0
          : Number(
              ((subject.presentCount / subject.totalClasses) * 100).toFixed(1)
            ),
      presentDates: subject.presentDates,
      teachers: Object.values(subject.teachers).map((t) => ({
        teacherName: t.teacherName,
        attendance: `${t.present} / ${t.total}`,
        percentage:
          t.total === 0
            ? 0
            : Number(((t.present / t.total) * 100).toFixed(1)),
        presentDates: t.presentDates,
      })),
    }));

    res.json(result);
  } catch (error) {
    console.error("Student Attendance Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================================
 * TEACHER → SUBJECT ATTENDANCE STATS
 * =========================================
 */
exports.getSubjectAttendanceStats = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const baseSubject = await Subject.findById(subjectId);
    if (!baseSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const relatedSubjects = await Subject.find({
      subjectName: baseSubject.subjectName,
      batch: baseSubject.batch,
      semester: baseSubject.semester,
    });

    const subjectIds = relatedSubjects.map((s) => s._id);

    const attendanceDocs = await Attendance.find({
      subject: { $in: subjectIds },
    }).populate("records.student", "fullName");

    const studentMap = {};

    attendanceDocs.forEach((doc) => {
      doc.records.forEach((r) => {
        // ✅ FIX: SAFETY CHECK (ONLY ADDITION)
        if (!r.student || !r.student._id) return;

        const sid = r.student._id.toString();

        if (!studentMap[sid]) {
          studentMap[sid] = {
            studentId: sid,
            fullName: r.student.fullName,
            present: 0,
            total: 0,
          };
        }

        studentMap[sid].total += 1;
        if (r.status === "Present") {
          studentMap[sid].present += 1;
        }
      });
    });

    const result = Object.values(studentMap).map((s) => ({
      ...s,
      percentage:
        s.total === 0 ? 0 : Number(((s.present / s.total) * 100).toFixed(1)),
    }));

    res.json(result);
  } catch (error) {
    console.error("Teacher Subject Stats Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const Subject = require("../models/Subjects");

// ✅ Teacher creates subject
exports.createSubject = async (req, res) => {
  try {
    const { subjectName, batch, semester } = req.body;

    if (!subjectName || !batch || !semester) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const subject = await Subject.create({
      subjectName,
      teacher: req.user.id,
      batch,
      semester,
    });

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Teacher fetches own subjects
exports.getMySubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ teacher: req.user.id });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Student fetches subjects (AUTO SYNC)
exports.getStudentSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({
      batch: req.user.batch,
      semester: req.user.semester,
    }).populate("teacher", "fullName");

    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

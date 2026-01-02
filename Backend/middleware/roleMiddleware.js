const teacherOnly = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

const studentOnly = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = {
  teacherOnly,
  studentOnly,
};

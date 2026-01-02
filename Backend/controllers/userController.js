const User = require("../models/User");

exports.getStudents = async (req, res) => {
  const { batch, semester } = req.query;

  const students = await User.find({
    role: "student",
    batch,
    semester,
  }).select("-password");

  res.json(students);
};

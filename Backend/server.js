const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const User = require("./models/User");


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/subjects", require("./routes/subjectRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/users", require("./routes/userRoutes"));



app.get("/", (req, res) => {
  res.send("Attendance Tracker API Running");
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

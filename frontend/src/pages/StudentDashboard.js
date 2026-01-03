import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchAttendance = async () => {
      const res = await axios.get("/attendance/student");
      setAttendance(res.data);
    };

    fetchAttendance();
  }, [user]);

  const calculatePercentage = (records) => {
    const total = records.length;
    const present = records.filter((r) => r.status === "Present").length;
    return ((present / total) * 100).toFixed(0);
  };

  return (
    <div>
      <h2>Student Dashboard</h2>

      {attendance.length === 0 && <p>No attendance records found</p>}

      {attendance.map((item) => (
        <div key={item._id} style={{ marginBottom: "10px" }}>
          <h4>{item.subject.subjectName}</h4>
          <p>Date: {item.date}</p>
          <p>
            Attendance: {calculatePercentage(item.records)}%
          </p>
          <progress
            value={calculatePercentage(item.records)}
            max="100"
          />
        </div>
      ))}
    </div>
  );
};

export default StudentDashboard;

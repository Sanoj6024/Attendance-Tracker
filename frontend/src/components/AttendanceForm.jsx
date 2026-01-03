import { useEffect, useState } from "react";
import API from "../services/api";

export default function AttendanceForm() {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    API.get("/subjects/teacher").then((res) => setSubjects(res.data));
  }, []);

  useEffect(() => {
    if (!subjectId) return;
    API.get("/users/students?batch=2022-2026&semester=5")
      .then((res) => setStudents(res.data));
  }, [subjectId]);

  const markAttendance = (studentId, status) => {
    setAttendance({ ...attendance, [studentId]: status });
  };

  const submitAttendance = async () => {
    const records = Object.keys(attendance).map((id) => ({
      studentId: id,
      status: attendance[id],
    }));

    await API.post("/attendance/mark", {
      subjectId,
      date,
      records,
    });

    alert("Attendance submitted ✅");
  };

  return (
    <div>
      <h3>Mark Attendance</h3>

      <select onChange={(e) => setSubjectId(e.target.value)}>
        <option>Select Subject</option>
        {subjects.map((s) => (
          <option key={s._id} value={s._id}>
            {s.subjectName}
          </option>
        ))}
      </select>

      <br /><br />

      <input type="date" onChange={(e) => setDate(e.target.value)} />

      <br /><br />

      {students.map((s) => (
        <div key={s._id}>
          {s.fullName}
          <button onClick={() => markAttendance(s._id, "Present")}>
            Present
          </button>
          <button onClick={() => markAttendance(s._id, "Absent")}>
            Absent
          </button>
        </div>
      ))}

      <br />
      <button onClick={submitAttendance}>Submit Attendance</button>
    </div>
  );
}

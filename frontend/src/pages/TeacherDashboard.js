import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const TeacherDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  // =========================
  // Fetch teacher subjects
  // =========================
  const fetchSubjects = useCallback(async () => {
    try {
      const res = await axios.get("/subjects/teacher");
      setSubjects(res.data);
    } catch (err) {
      console.error("Error fetching subjects", err);
    }
  }, []);

  // =========================
  // Fetch students (sorted A-Z)
  // =========================
  const fetchStudents = async (subject) => {
    try {
      setSelectedSubject(subject);

      const res = await axios.get(
        `/users/students?batch=${subject.batch}&semester=${subject.semester}`
      );

      // ✅ sort students alphabetically
      const sortedStudents = res.data.sort((a, b) =>
        a.fullName.localeCompare(b.fullName)
      );

      setStudents(sortedStudents);

      // initialize attendance
      const initialAttendance = {};
      sortedStudents.forEach((s) => {
        initialAttendance[s._id] = "Present";
      });

      setAttendance(initialAttendance);
    } catch (err) {
      console.error("Error fetching students", err);
    }
  };

  // =========================
  // Submit attendance (today's date auto)
  // =========================
  const submitAttendance = async () => {
    try {
      const records = Object.keys(attendance).map((studentId) => ({
        studentId,
        status: attendance[studentId],
      }));

      const today = new Date().toISOString().split("T")[0];

      await axios.post("/attendance/mark", {
        subjectId: selectedSubject._id,
        date: today,
        attendance: records,
      });

      alert("Attendance marked successfully ✅");
    } catch (err) {
      console.error("Attendance error", err);
      alert("Failed to mark attendance ❌");
    }
  };

  // =========================
  // Load subjects when logged in
  // =========================
  useEffect(() => {
    if (!user) return;
    fetchSubjects();
  }, [user, fetchSubjects]);

  if (!user) return null;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Attendance Tracker</h1>

      <div style={{ float: "right" }}>
        <b>{user.fullName}</b>{" "}
        <button onClick={logout}>Logout</button>
      </div>

      <h2>Teacher Dashboard</h2>

      {/* SUBJECTS */}
      <h3>Your Subjects</h3>
      {subjects.length === 0 && <p>No subjects found</p>}

      {subjects.map((sub) => (
        <button
          key={sub._id}
          style={{ marginRight: "10px", marginBottom: "10px" }}
          onClick={() => fetchStudents(sub)}
        >
          {sub.subjectName} ({sub.batch})
        </button>
      ))}

      {/* STUDENTS */}
      {students.length > 0 && (
        <>
          <h3>Mark Attendance</h3>

          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Student Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, index) => (
                <tr key={s._id}>
                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                  <td>{s.fullName}</td>
                  <td>
                    <select
                      value={attendance[s._id]}
                      onChange={(e) =>
                        setAttendance({
                          ...attendance,
                          [s._id]: e.target.value,
                        })
                      }
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <br />
          <button onClick={submitAttendance}>
            Submit Attendance
          </button>
        </>
      )}
    </div>
  );
};

export default TeacherDashboard;

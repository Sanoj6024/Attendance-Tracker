import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import DarkModeToggle from "../components/DarkModeToggle";

const TeacherDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  // =========================
  // Subject creation state
  // =========================
  const [subjectName, setSubjectName] = useState("");
  const [batch, setBatch] = useState("2022-2026");
  const [semester, setSemester] = useState(5);
  const [loading, setLoading] = useState(false);

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
  // Create new subject ✅ FIXED
  // =========================
  const createSubject = async (e) => {
    e.preventDefault();

    if (!subjectName.trim()) {
      alert("Subject name is required");
      return;
    }

    try {
      setLoading(true);

      // 🔥 CORRECT ENDPOINT
      await axios.post("/subjects", {
        subjectName,
        batch,
        semester,
      });

      alert("Subject created successfully ✅");

      setSubjectName("");
      setBatch("2022-2026");
      setSemester(5);

      fetchSubjects();
    } catch (err) {
      console.error("Create subject error", err.response?.data || err);
      alert("Failed to create subject ❌");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Fetch students for subject
  // =========================
  const fetchStudents = async (subject) => {
    try {
      setSelectedSubject(subject);

      const res = await axios.get(
        `/users/students?batch=${subject.batch}&semester=${subject.semester}`
      );

      const sortedStudents = res.data.sort((a, b) =>
        a.fullName.localeCompare(b.fullName)
      );

      setStudents(sortedStudents);

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
  // Submit attendance
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
  // Load subjects on login
  // =========================
  useEffect(() => {
    if (user) fetchSubjects();
  }, [user, fetchSubjects]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow">
        <h1 className="text-xl font-bold">Teacher Dashboard</h1>

        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <span>{user.fullName}</span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* ========================= */}
        {/* CREATE SUBJECT */}
        {/* ========================= */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="font-semibold text-lg mb-3">Add New Subject</h2>

          <form onSubmit={createSubject} className="flex gap-3 flex-wrap">
            <input
              className="border p-2 rounded text-black"
              placeholder="Subject Name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />

            <input
              className="border p-2 rounded text-black"
              placeholder="Batch (e.g. 2022-2026)"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
            />

            <input
              className="border p-2 rounded text-black w-24"
              type="number"
              min="1"
              max="8"
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Creating..." : "Add Subject"}
            </button>
          </form>
        </div>

        {/* ========================= */}
        {/* SUBJECT LIST */}
        {/* ========================= */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Your Subjects</h2>

          {subjects.length === 0 && <p>No subjects found</p>}

          <div className="flex gap-3 flex-wrap">
            {subjects.map((sub) => (
              <button
                key={sub._id}
                onClick={() => fetchStudents(sub)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {sub.subjectName} ({sub.batch})
              </button>
            ))}
          </div>
        </div>

        {/* ========================= */}
        {/* ATTENDANCE TABLE */}
        {/* ========================= */}
        {students.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Mark Attendance</h3>

            <table className="w-full border">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="p-2">S.No</th>
                  <th className="p-2">Student</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s, index) => (
                  <tr key={s._id} className="border-t">
                    <td className="p-2 text-center">{index + 1}</td>
                    <td className="p-2">{s.fullName}</td>
                    <td className="p-2">
                      <select
                        value={attendance[s._id]}
                        onChange={(e) =>
                          setAttendance({
                            ...attendance,
                            [s._id]: e.target.value,
                          })
                        }
                        className="border p-1 rounded text-black"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={submitAttendance}
              className="mt-4 bg-green-600 text-white px-5 py-2 rounded"
            >
              Submit Attendance
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;

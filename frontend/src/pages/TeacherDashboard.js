import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const TeacherDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [attendance, setAttendance] = useState({});

  const [subjectName, setSubjectName] = useState("");
  const [batch, setBatch] = useState("2022-2026");
  const [semester, setSemester] = useState(5);

  const fetchSubjects = useCallback(async () => {
    const res = await axios.get("/subjects/teacher");
    setSubjects(res.data);
  }, []);

  const createSubject = async (e) => {
    e.preventDefault();
    await axios.post("/subjects", { subjectName, batch, semester });
    setSubjectName("");
    fetchSubjects();
  };

  const fetchStudents = async (sub) => {
    setSelectedSubject(sub);
    const res = await axios.get(
      `/users/students?batch=${sub.batch}&semester=${sub.semester}`
    );
    const sorted = res.data.sort((a, b) =>
      a.fullName.localeCompare(b.fullName)
    );
    setStudents(sorted);

    const initial = {};
    sorted.forEach((s) => (initial[s._id] = "Present"));
    setAttendance(initial);
  };

  const submitAttendance = async () => {
    try {
      const records = Object.keys(attendance).map((id) => ({
        studentId: id,
        status: attendance[id],
      }));

      await axios.post("/attendance/mark", {
        subjectId: selectedSubject._id,
        date: new Date().toISOString().split("T")[0],
        attendance: records,
      });

      alert("Attendance marked successfully ✅");
    } catch (err) {
      if (
        err.response &&
        err.response.data.message ===
          "Attendance already marked for this date"
      ) {
        alert("⚠️ Attendance already marked for today for this subject");
      } else {
        alert("❌ Failed to mark attendance");
      }
    }
  };

  useEffect(() => {
    if (user) fetchSubjects();
  }, [user, fetchSubjects]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-black border-b border-[#282828]">
        <h1 className="text-xl font-bold">AttendEase</h1>
        <div className="flex gap-4 items-center">
          <span className="text-lg">{user.fullName}</span>
          <button
            onClick={logout}
            className="bg-[#1DB954] text-black px-4 py-2 rounded-full font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="text-center mt-6">
        <h2 className="text-2xl font-bold">Teacher Dashboard</h2>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Create Subject */}
        <div className="bg-[#181818] p-5 rounded-lg mb-6">
          <h3 className="font-semibold mb-5">➕ Create Subject</h3>
          <form onSubmit={createSubject} className="flex gap-3 flex-wrap">
            <input
              placeholder="Subject Name"
              className="bg-[#121212] border border-[#282828] p-2 rounded"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
            />
            <input
              placeholder="Batch"
              className="bg-[#121212] border border-[#282828] p-2 rounded"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
            />
            <input
              type="number"
              className="bg-[#121212] border border-[#282828] p-2 rounded w-20"
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
            />
            <button className="bg-[#1DB954] text-black px-4 rounded font-semibold">
              Add
            </button>
          </form>
        </div>

        {/* Subjects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subjects.map((sub) => (
            <div
              key={sub._id}
              onClick={() => fetchStudents(sub)}
              className="bg-[#181818] p-4 rounded-lg cursor-pointer hover:bg-[#2A2A2A]"
            >
              <h3 className="font-semibold">{sub.subjectName}</h3>
              <p className="text-sm text-gray-400">
                {sub.batch} • Sem {sub.semester}
              </p>
            </div>
          ))}
        </div>

        {/* Attendance */}
        {students.length > 0 && (
          <div className="mt-6 bg-[#181818] p-5 rounded-lg">
            <h3 className="font-semibold mb-3">Mark Attendance</h3>
           <table className="w-full text-base">
  <thead className="text-gray-400 border-b border-[#282828]">
    <tr>
      <th className="py-3 text-center w-16">#</th>
      <th className="py-3 text-left">Name</th>
      <th className="py-3 text-center w-40">Status</th>
    </tr>
  </thead>
  <tbody>
    {students.map((s, i) => (
      <tr
        key={s._id}
        className="border-b border-[#282828] hover:bg-[#2A2A2A]"
      >
        <td className="py-3 text-center">{i + 1}</td>
        <td className="py-3 text-left font-medium">{s.fullName}</td>
        <td className="py-3 text-center">
          <select
            className="bg-[#121212] border border-[#282828] rounded px-3 py-1"
            value={attendance[s._id]}
            onChange={(e) =>
              setAttendance({
                ...attendance,
                [s._id]: e.target.value,
              })
            }
          >
            <option>Present</option>
            <option>Absent</option>
          </select>
        </td>
      </tr>
    ))}
  </tbody>
</table>


            <button
              onClick={submitAttendance}
              className="mt-4 bg-[#1DB954] text-black px-6 py-2 rounded-full font-semibold"
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

import React, { useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [attendanceData, setAttendanceData] = useState([]);

  // =========================
  // Fetch attendance
  // =========================
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get("/attendance/student");
        setAttendanceData(res.data);
      } catch (err) {
        console.error("Attendance fetch error", err);
      }
    };

    if (user) fetchAttendance();
  }, [user]);

  if (!user) return null;

  // =========================
  // Progress color logic
  // =========================
  const getColor = (percentage) => {
    if (percentage >= 85) return "bg-green-500";
    if (percentage >= 60) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
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
        <h2 className="text-2xl font-bold">Student Dashboard</h2>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-gray-400 mb-6">
          Batch: <b>{user.batch}</b> | Semester: <b>{user.semester}</b>
        </p>

        {attendanceData.length === 0 && (
          <p className="text-gray-400">No attendance records found</p>
        )}

        {/* SUBJECT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {attendanceData.map((sub) => (
            <div
              key={sub.subjectId}
              className="bg-[#181818] p-5 rounded-xl shadow hover:bg-[#222]"
            >
              {/* SUBJECT NAME */}
              <h2 className="text-lg font-semibold mb-2">
                {sub.subjectName}
              </h2>

              {/* STATS */}
              <div className="text-sm text-gray-300 mb-3">
                <p>Total Classes: {sub.totalClasses}</p>
                <p>
                  Attendance: {sub.presentCount} / {sub.totalClasses}
                </p>
              </div>

              {/* PERCENTAGE */}
              <p className="mb-2">
                Percentage:{" "}
                <span className="font-semibold">
                  {sub.percentage}%
                </span>
              </p>

              {/* PROGRESS BAR */}
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full ${getColor(sub.percentage)}`}
                  style={{ width: `${sub.percentage}%` }}
                ></div>
              </div>

              {/* PRESENT DATES */}
              <details className="text-sm">
                <summary className="cursor-pointer text-[#1DB954] font-medium">
                  View Present Dates
                </summary>

                {sub.presentDates.length > 0 ? (
                  <ul className="mt-2 list-disc ml-5 text-gray-300">
                    {sub.presentDates.map((date, i) => (
                      <li key={i}>
                        {new Date(date).toLocaleDateString("en-GB")}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-gray-400">
                    No present records
                  </p>
                )}
              </details>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

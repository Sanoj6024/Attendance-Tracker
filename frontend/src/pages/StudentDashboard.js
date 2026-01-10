import React, { useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [attendanceData, setAttendanceData] = useState([]);

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

  const getColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 65) return "bg-orange-500";
    return "bg-red-500";
  };

  const getTextColor = (percentage) => {
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 65) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-black border-b border-[#282828]">
        <h1 className="text-xl font-bold">Mirae</h1>
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

      <div className="text-center mt-6">
        <h2 className="text-2xl font-bold">Student Dashboard</h2>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <p className="text-gray-400 mb-6">
          Batch: <b>{user.batch}</b> | Semester: <b>{user.semester}</b>
        </p>

        {attendanceData.length === 0 && (
          <p className="text-gray-400">No attendance records found</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {attendanceData.map((sub, index) => (
            <div
              key={index}
              className="bg-[#181818] p-5 rounded-xl shadow hover:bg-[#222]"
            >
              <h2 className="text-lg font-semibold mb-2">
                {sub.subjectName}
              </h2>

              <div className="text-sm text-gray-300 mb-3">
                <p>Total Classes: {sub.totalClasses}</p>
                <p>
                  Attendance: {sub.presentCount} / {sub.totalClasses}
                </p>
              </div>

              <p className={`mb-2 font-semibold ${getTextColor(sub.percentage)}`}>
                Overall Percentage: {sub.percentage}%
              </p>

              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full ${getColor(sub.percentage)}`}
                  style={{ width: `${sub.percentage}%` }}
                ></div>
              </div>

              {/* TEACHER-WISE ATTENDANCE */}
              {sub.teachers && sub.teachers.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2 text-gray-300">
                    Teacher-wise Attendance
                  </h4>

                  <table className="w-full text-sm border border-[#282828] rounded">
                    <thead className="text-gray-400 border-b border-[#282828]">
                      <tr>
                        <th className="text-left p-2">Teacher</th>
                        <th className="text-center p-2">Classes</th>
                        <th className="text-center p-2">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sub.teachers.map((t, i) => (
                        <tr key={i} className="border-b border-[#282828]">
                          <td className="p-2">{t.teacherName}</td>
                          <td className="text-center p-2">
                            {t.attendance}
                          </td>
                          <td
                            className={`text-center p-2 font-semibold ${getTextColor(
                              t.percentage
                            )}`}
                          >
                            {t.percentage}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ✅ UPDATED: TEACHER-WISE PRESENT DATES */}
              <details className="text-sm">
                <summary className="cursor-pointer text-[#1DB954] font-medium">
                  View Present Dates
                </summary>

                {sub.teachers && sub.teachers.length > 0 ? (
                  <div className="mt-3 space-y-3">
                    {sub.teachers.map((t, i) => (
                      <div key={i}>
                        <p className="font-semibold text-gray-300">
                          {t.teacherName}
                        </p>

                        {t.presentDates && t.presentDates.length > 0 ? (
                          <ul className="list-disc ml-6 text-gray-400">
                            {t.presentDates.map((date, j) => (
                              <li key={j}>
                                {new Date(date).toLocaleDateString("en-GB")}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="ml-6 text-gray-500 text-xs">
                            No present dates
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-gray-400">No present records</p>
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

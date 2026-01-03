import React, { useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import DarkModeToggle from "../components/DarkModeToggle";

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get("/attendance/student");
        setAttendanceData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAttendance();
  }, []);

  if (!user) return null;

  const getColor = (p) =>
    p >= 75 ? "bg-green-500" : p >= 60 ? "bg-orange-400" : "bg-red-500";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow">
        <h1 className="text-xl font-bold">Attendance Tracker</h1>
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

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto mt-6 px-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded shadow mb-6">
          <h2 className="text-lg font-semibold">Student Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Batch: {user.batch} | Semester: {user.semester}
          </p>
        </div>

        {attendanceData.length === 0 && (
          <p className="text-center text-gray-500">
            No attendance records found
          </p>
        )}

        {attendanceData.map((sub) => (
          <div
            key={sub.subjectId}
            className="bg-white dark:bg-gray-800 p-5 rounded shadow mb-5"
          >
            <h3 className="text-lg font-bold mb-2">{sub.subjectName}</h3>

            <p>Total Classes: {sub.totalClasses}</p>
            <p>
              Attendance: {sub.presentCount}/{sub.totalClasses}
            </p>
            <p className="mb-2">Percentage: {sub.percentage}%</p>

            <div className="h-3 bg-gray-300 rounded overflow-hidden mb-3">
              <div
                className={`h-full ${getColor(sub.percentage)}`}
                style={{ width: `${sub.percentage}%` }}
              />
            </div>

            <details>
              <summary className="cursor-pointer font-medium">
                Present Dates
              </summary>
              {sub.presentDates.length > 0 ? (
                <ul className="list-disc ml-6 mt-2">
                  {sub.presentDates.map((d, i) => (
                    <li key={i}>
                      {new Date(d).toLocaleDateString("en-GB")}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mt-2">No present records</p>
              )}
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;

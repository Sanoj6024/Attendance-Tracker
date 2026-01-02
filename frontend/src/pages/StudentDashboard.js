import { useEffect, useState } from "react";
import api from "../api/axios";

const StudentDashboard = () => {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    api.get("/attendance/student").then((res) => {
      setSummary(res.data.summary);
    });
  }, []);

  return (
    <div>
      <h2>Student Dashboard</h2>

      {summary.map((item, index) => (
        <div key={index}>
          <h4>{item.subject}</h4>
          <p>
            {item.present}/{item.totalClasses} classes
          </p>

          <div style={{ background: "#ddd", width: "200px" }}>
            <div
              style={{
                background: "green",
                width: `${item.percentage}%`,
                color: "white",
              }}
            >
              {item.percentage}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentDashboard;

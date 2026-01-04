import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
    batch: "2022-2026",
    semester: 5,
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("/auth/register", form);
      alert("Registered successfully ✅");
      navigate("/");
    } catch {
      setError("❌ User already registered with this email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212]">
      <div className="bg-[#181818] p-8 rounded-xl w-96 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
           Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="fullName"
            placeholder="Full Name"
            className="w-full bg-[#121212] border border-[#282828] p-3 rounded text-white"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full bg-[#121212] border border-[#282828] p-3 rounded text-white"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full bg-[#121212] border border-[#282828] p-3 rounded text-white"
            onChange={handleChange}
            required
          />

          <select
            name="role"
            className="w-full bg-[#121212] border border-[#282828] p-3 rounded text-white"
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <input
            name="batch"
            placeholder="Batch (2022-2026)"
            className="w-full bg-[#121212] border border-[#282828] p-3 rounded text-white"
            onChange={handleChange}
          />

          <input
            name="semester"
            type="number"
            placeholder="Semester (1-8)"
            min="1"
            max="8"
            className="w-full bg-[#121212] border border-[#282828] p-3 rounded text-white"
            onChange={handleChange}
          />

          <button className="w-full bg-[#1DB954] text-black font-semibold py-3 rounded-full hover:scale-105 transition">
            Register
          </button>
        </form>

        {/* 🔴 ALERT BELOW FORM */}
        {error && (
          <div className="mt-4 bg-red-600 text-white text-sm p-3 rounded text-center">
            {error}
          </div>
        )}

        {/* 🔗 LOGIN LINK */}
        <p className="text-center mt-4 text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/" className="text-[#1DB954] font-semibold">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

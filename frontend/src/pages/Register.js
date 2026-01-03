import { useState } from "react";
import axios from "axios";
import DarkModeToggle from "../components/DarkModeToggle";

const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
    batch: "",
    semester: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/auth/register", form);
    alert("Registered successfully ✅");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-96 text-black dark:text-white">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-lg">Register</h2>
          <DarkModeToggle />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input className="border p-2 rounded text-black" name="fullName" placeholder="Full Name" onChange={handleChange} />
          <input className="border p-2 rounded text-black" name="email" placeholder="Email" onChange={handleChange} />
          <input type="password" className="border p-2 rounded text-black" name="password" placeholder="Password" onChange={handleChange} />

          <select name="role" onChange={handleChange} className="border p-2 rounded text-black">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <input className="border p-2 rounded text-black" name="batch" placeholder="Batch (2022-2026)" onChange={handleChange} />
          <input className="border p-2 rounded text-black" name="semester" placeholder="Semester" onChange={handleChange} />

          <button className="bg-green-500 text-white py-2 rounded">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

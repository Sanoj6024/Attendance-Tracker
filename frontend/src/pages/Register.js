import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
    batch: "",
    semester: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/auth/register", form);
    alert("Registration successful. Please login.");
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      <input name="fullName" placeholder="Full Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <select name="role" onChange={handleChange}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>

      <input name="batch" placeholder="Batch (e.g. 2022-2026)" onChange={handleChange} />
      <input name="semester" placeholder="Semester" onChange={handleChange} />

      <button>Register</button>
    </form>
  );
};

export default Register;

import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/auth/register", form);
      alert("Registration successful ✅");
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Registration failed ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
      <h2>Register</h2>

      <input
        name="fullName"
        placeholder="Full Name"
        onChange={handleChange}
        required
      />

      <br />

      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />

      <br />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />

      <br />

      <select name="role" onChange={handleChange}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>

      <br />

      <input
        name="batch"
        placeholder="Batch (eg: 2022-2026)"
        value={form.batch}
        onChange={handleChange}
      />

      <br />

      <input
        name="semester"
        type="number"
        value={form.semester}
        onChange={handleChange}
      />

      <br /><br />

      <button type="submit">Register</button>
    </form>
  );
};

export default Register;

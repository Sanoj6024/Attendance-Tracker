import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
    } catch {
      setError("❌ Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212]">
      <div className="bg-[#181818] p-8 rounded-xl w-96 shadow-lg">

        {/* 🔵 MAIN BRAND HEADING */}
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          AttendEase
        </h1>

        {/* 🔵 FORM TITLE */}
        <h2 className="text-xl font-semibold text-center mb-6 text-gray-300">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-[#121212] border border-[#282828] p-3 rounded text-white focus:outline-none focus:border-[#1DB954]"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-[#121212] border border-[#282828] p-3 rounded text-white focus:outline-none focus:border-[#1DB954]"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full bg-[#1DB954] text-black font-semibold py-3 rounded-full hover:scale-105 transition">
            Log In
          </button>
        </form>

        {/* 🔴 ALERT BELOW FORM */}
        {error && (
          <div className="mt-4 bg-red-600 text-white text-sm p-3 rounded text-center">
            {error}
          </div>
        )}

        <p className="text-center mt-4 text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#1DB954] font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

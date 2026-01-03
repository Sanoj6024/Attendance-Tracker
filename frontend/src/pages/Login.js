import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import DarkModeToggle from "../components/DarkModeToggle";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });

    login(res.data.user, res.data.token);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-96 text-black dark:text-white">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold">Login</h2>
          <DarkModeToggle />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="border p-2 rounded text-black"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="border p-2 rounded text-black"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-blue-500 text-white py-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

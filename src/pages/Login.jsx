import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
  if (!form.email || !form.password)
    return toast.error("Please enter email & password.");

  try {
    setLoading(true);

    localStorage.removeItem("user");
    localStorage.removeItem("token");


    const res = await api.post("/auth/login", form);

    // if backend returns success=false or missing token
    if (!res.data || !res.data.token || !res.data.user) {
      return toast.error("Invalid login credentials.");
    }
    
    // SUCCESS
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    toast.success("Login successful!");
    

    // role-based redirect
    if (res.data.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }

  } catch (err) {
    // error from backend (400 or 500)
    toast.error("Invalid login credentials.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-calmLight to-white dark:from-darkBg dark:to-darkBg2
      flex items-center justify-center px-4 transition">

      <div className="bg-white/70 dark:bg-darkBg2/70 backdrop-blur-xl shadow-2xl rounded-3xl p-10 
        w-full max-w-md border border-white/40 dark:border-gray-700 transition">

        {/* Logo */}
        <h1 className="text-4xl font-extrabold text-center text-calm dark:text-indigo-300 mb-6 tracking-tight">
          MindMate
        </h1>


        {/* Email */}
        <div className="mb-5">
          <label className="text-gray-700 dark:text-gray-300 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="mt-1 w-full p-3 rounded-xl border dark:border-gray-700 
              bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="mb-7">
          <label className="text-gray-700 dark:text-gray-300 font-semibold">Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="mt-1 w-full p-3 rounded-xl border dark:border-gray-700 
              bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm"
            placeholder="Enter password"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-calm text-white py-3 rounded-xl shadow-md font-semibold text-lg
            hover:bg-calm/90 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-300">
          Forgot password?{" "}
          <span
            onClick={() => navigate("/forgot-password")}
            className="text-calm dark:text-indigo-300 cursor-pointer hover:underline"
          >
            Reset here
          </span>
        </p>

        <p className="text-center mt-3 text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-calm dark:text-indigo-300 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}


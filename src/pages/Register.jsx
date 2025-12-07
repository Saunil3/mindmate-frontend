import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password) {
      return toast.error("All fields are required.");
    }

    try {
      await api.post("/auth/register", form);
      toast.success("Account created!");
      navigate("/login");
    } catch (err) {
      toast.error("Email already exists.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-calmLight to-white dark:from-darkBg dark:to-darkBg2 flex items-center justify-center px-4">

      <div className="bg-white/70 dark:bg-darkBg2/70 backdrop-blur-xl shadow-2xl rounded-3xl p-10
        w-full max-w-md border border-white/40 dark:border-gray-700 transition">

        <h1 className="text-4xl font-extrabold text-center text-calm dark:text-indigo-300 mb-6">
          MindMate
        </h1>

        <h2 className="text-center text-gray-700 dark:text-gray-300 text-xl mb-8">
          Create Your Account ✨
        </h2>

        {/* Username */}
        <div className="mb-5">
          <label className="text-gray-700 dark:text-gray-300 font-semibold">Username</label>
          <input
            type="text"
            className="mt-1 w-full p-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="text-gray-700 dark:text-gray-300 font-semibold">Email</label>
          <input
            type="email"
            className="mt-1 w-full p-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Password */}
        <div className="mb-7">
          <label className="text-gray-700 dark:text-gray-300 font-semibold">Password</label>
          <input
            type="password"
            className="mt-1 w-full p-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        {/* Confirm Password — Added */}
        <div className="mb-7">
          <label className="text-gray-700 dark:text-gray-300 font-semibold">Confirm Password</label>
          <input
            type="password"
            className="mt-1 w-full p-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />
        </div>
        <button
          onClick={handleRegister}
          className="w-full bg-calm text-white py-3 rounded-xl shadow-md hover:bg-calm/90"
        >
          Register
        </button>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-calm dark:text-indigo-300 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}


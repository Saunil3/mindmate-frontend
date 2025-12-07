import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return toast.error("Enter your registered email.");

    try {
      setLoading(true);
      const res = await api.post("/auth/forgot-password", { email });

      toast.success("Reset link sent!");
      if (res.data.resetLink) window.open(res.data.resetLink, "_blank");
    } catch {
      toast.error("Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-calmLight to-white dark:from-darkBg dark:to-darkBg2 px-4">

      <div className="bg-white/70 dark:bg-darkBg2/70 backdrop-blur-xl p-10 rounded-3xl w-full max-w-md shadow-xl border border-white/40 dark:border-gray-700">

        <h1 className="text-4xl font-bold text-center text-calm dark:text-indigo-300 mb-6">
          MindMate
        </h1>

        <h2 className="text-gray-700 dark:text-gray-300 text-center text-lg mb-6">
          Reset Your Password 🔐
        </h2>

        <label className="text-gray-700 dark:text-gray-300 font-semibold">Email</label>
        <input
          type="email"
          className="w-full p-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 mt-1"
          placeholder="Enter your registered email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 bg-calm text-white py-3 rounded-xl shadow hover:bg-calm/90 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Get Reset Link"}
        </button>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-300">
          Remember your password?{" "}
          <span onClick={() => navigate("/login")} className="text-calm dark:text-indigo-300 cursor-pointer hover:underline">
            Login
          </span>
        </p>
      </div>
    </div>
  );
}


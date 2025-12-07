import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast"; 
import api from "../api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Extract email from query string (?email=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromQuery = params.get("email");
    if (emailFromQuery) setEmail(emailFromQuery);
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await api.post("/reset-password/${token}",
        { email, newPassword }
      );

      toast.success(res.data.message || "Password reset successful!", {
        duration: 2000,
      });

      setTimeout(() => navigate("/login", { state: { fromReset: true } }), 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      const msg =
        err.response?.data?.message ||
        "Error resetting password. Try again or check backend logs.";
      setError(msg);
      toast.error(msg, { duration: 3000 });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-primary/30">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Reset Password for {email || "your account"}
        </h2>

        <input
          type="password"
          placeholder="Enter new password"
          className="border w-full p-3 mb-3 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          className="border w-full p-3 mb-5 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-calm w-full p-2 rounded font-semibold hover:bg-calm/80"
        >
          Reset Password
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Remembered your password?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Go back to Login
          </span>
        </p>
      </form>
    </div>
  );
}


import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If a specific role is required and doesn't match, redirect to dashboard
  if (role && user.role !== role) {
    return <Navigate to="/dashboard" />;
  }

  // Otherwise allow access
  return children;
}

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./routes/ProtectedRoute";

import FriendsList from "./pages/FriendsList";
import ManageUsers from "./pages/admin/ManageUsers";
import ViewJournals from "./pages/admin/ViewJournals";
import SystemInsights from "./pages/admin/SystemInsights";
import Home from "./pages/Home";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>

          <Toaster position="top-center" reverseOrder={false} />

          <Routes>

            {/* PUBLIC HOME PAGE */}
            <Route path="/" element={<Home />} />

            {/* AUTH ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* USER DASHBOARD (PROTECTED) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* ADMIN PANEL */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute role="admin">
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/journals"
              element={
                <ProtectedRoute role="admin">
                  <ViewJournals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/insights"
              element={
                <ProtectedRoute role="admin">
                  <SystemInsights />
                </ProtectedRoute>
              }
            />

            {/* FRIENDS PAGE */}
            <Route
              path="/friends"
              element={
                <ProtectedRoute>
                  <FriendsList />
                </ProtectedRoute>
              }
            />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>

        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

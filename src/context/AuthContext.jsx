import { createContext, useState, useEffect } from "react";
import axios from "axios";
import api from "../api";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password, navigate) => {
  const res = await api.post("/login", {
    email,
    password
  });

  const user = res.data.user;

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(user));
  setUser(user);

  // Role-based redirect
  if (user.role === "admin") {
    navigate("/admin");
  } else {
    navigate("/dashboard");
  }
};

const [requestCount, setRequestCount] = useState(0);

const loadRequestCount = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/friends/requests/pending",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  setRequestCount(res.data.count);
};

  const register = async (name, email, password) => {
    await api.post("/auth/register", { username: name, email, password });
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    await loadRequestCount();
  };

  useEffect(() => {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  // If NO token → force logout
  if (!token) {
    setUser(null);
    localStorage.removeItem("user");
    return;
  }

  // If BOTH exist → load user
  if (token && savedUser) {
    setUser(JSON.parse(savedUser));
    loadRequestCount();
    
    const interval = setInterval(() => {
      loadRequestCount();
    }, 10000);

    return () => clearInterval(interval);
  }
}, []);


  return (
    <AuthContext.Provider value={{ user, login, register, logout, requestCount, loadRequestCount }}>
      {children}
    </AuthContext.Provider>
  );
};


import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react"; 
import axios from "axios";
import toast from "react-hot-toast";
import { Line } from "react-chartjs-2";
import api from "../api";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminPanel() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);

      const trendData = res.data.trend.map((item) => ({
        day: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        mood: item.avg_score,
      }));

      setTrend(trendData);
      toast.success("Analytics refreshed", { duration: 1500 });
    } catch (err) {
      console.error("Analytics error:", err);
      toast.error("Failed to load analytics data");
    }
  };

  const exportToCSV = () => {
    if (!stats) return;
    const csvData = [
      ["Metric", "Value"],
      ["Total Users", stats.users],
      ["Total Journals", stats.journals],
      ["Total Mood Entries", stats.moods],
      ["Average Mood Score", stats.averageMood],
    ];
    const csvString = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mindmate_analytics.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!stats) {
    return <p className="text-center mt-20 text-gray-500">Loading analytics...</p>;
  }

  const chartData = {
    labels: trend.map((t) => t.day),
    datasets: [
      {
        label: "Average Mood Trend (1–5)",
        data: trend.map((t) => t.mood),
        borderColor: trend.map((t) =>
          t.mood >= 4 ? "#22c55e" : t.mood <= 2 ? "#ef4444" : "#facc15"
        ),
        backgroundColor: "rgba(34,197,94,0.15)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: { y: { min: 0, max: 5 } },
    plugins: { legend: { display: false } },
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0f172a] text-gray-800 dark:text-gray-100 flex flex-col transition-all duration-300">
      <nav className="bg-white dark:bg-[#1e293b] shadow px-8 py-3 flex justify-between items-center transition-all duration-300">
        <h1 className="text-2xl font-bold text-calm dark:text-indigo-400">MindMate Admin Panel</h1>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            {theme === "light" ? (
              <Moon size={18} className="text-gray-700 dark:text-gray-200" />
            ) : (
              <Sun size={18} className="text-yellow-400" />
            )}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col justify-start items-center mt-8">
        <div className="bg-white dark:bg-gray-900 dark:text-gray-200 rounded-2xl shadow-lg p-10 w-[90%] max-w-5xl text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            Welcome, Admin {user?.username || ""}
          </h2>

          {/* Search Bar */}
          {/*
          <input
            type="text"
            placeholder="Search (User / Email / Journal)..."
            className="border p-2 rounded mb-6 w-full sm:w-1/2 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          /> */}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-2">
            <div className="bg-calm/20 p-4 rounded-lg shadow">
              <h3 className="font-semibold text-gray-700">Total Users</h3>
              <p className="text-3xl font-bold text-calm">{stats.users}</p>
            </div>
            <div className="bg-calm/20 p-4 rounded-lg shadow">
              <h3 className="font-semibold text-gray-700">Journals</h3>
              <p className="text-3xl font-bold text-calm">{stats.journals}</p>
            </div>
            <div className="bg-calm/20 p-4 rounded-lg shadow">
              <h3 className="font-semibold text-gray-700">Mood Entries</h3>
              <p className="text-3xl font-bold text-calm">{stats.moods}</p>
            </div>
            <div className="bg-calm/20 p-4 rounded-lg shadow sm:col-span-3 md:col-span-1">
              <h3 className="font-semibold text-gray-700">Avg. Mood Score</h3>
              <p className="text-3xl font-bold text-calm">{stats.averageMood}</p>
            </div>
          </div>

          {/* Inactive Users */}
          <div className="mt-8 text-left">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Inactive Users (7+ days)</h3>
            {stats.inactiveUsers.length === 0 ? (
              <p className="text-gray-500 text-sm">No inactive users detected.</p>
            ) : (
              <ul className="divide-y">
                {stats.inactiveUsers.map((u, i) => (
                  <li key={i} className="py-2 flex justify-between text-sm">
                    <span>{u.username} ({u.email})</span>
                    <span className="text-red-500">{u.days_inactive} days inactive</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Chart */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Mood Trend Overview</h3>
            <div className="w-full h-72">
              <Line data={chartData} options={chartOptions} />
            </div>
            <button
              onClick={exportToCSV}
              className="mt-4 bg-calm/70 hover:bg-calm text-gray-700 px-4 py-2 rounded font-semibold"
            >
              Export Analytics CSV
            </button>
          </div>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            <button
              onClick={() => navigate("/admin/users")}
              className="bg-calm/70 hover:bg-calm p-4 rounded-lg font-semibold text-gray-700"
            >
              Manage Users
            </button>
            <button
              onClick={() => navigate("/admin/journals")}
              className="bg-calm/70 hover:bg-calm p-4 rounded-lg font-semibold text-gray-700"
            >
              View Journals
            </button>
            <button
              onClick={() => navigate("/admin/insights")}
              className="bg-calm/70 hover:bg-calm p-4 rounded-lg font-semibold text-gray-700"
            >
              System Insights
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}


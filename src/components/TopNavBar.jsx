import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function TopNavBar({ currentSection, setCurrentSection, username }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { requestCount } = useContext(AuthContext);

  return (
    <div className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow z-50 transition-colors duration-300">
      
      {/* Top Row: Logo + Nav + Logout + Theme Toggle */}
      <div className="h-16 flex items-center justify-between px-8">
        
        {/* Logo */}
        <h1 className="text-2xl font-bold text-calm dark:text-calm-light">MindMate</h1>

        {/* Main Navigation */}
        <div className="flex items-center gap-6">
          {[
            { name: "Overview", id: "overview" },
            { name: "Mood Tracker", id: "mood" },
            { name: "Journal", id: "journal" },
            { name: "Breathing", id: "breathing" },
            { name: "Insights", id: "insights" },
            { name: "Users", id: "users" },
            { name: "Friends", id: "friends" },
            {
              name: (
                <div className="relative">
                  Requests
                  {requestCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {requestCount}
                    </span>
                  )}
                </div>
              ),
              id: "friendRequests",
            },
            { name: "Profile", id: "profile" },

          ].map((link) => (
            <button
              key={link.id}
              onClick={() => setCurrentSection(link.id)}
              className={`px-3 py-2 font-medium transition ${
                currentSection === link.id
                  ? "text-calm border-b-2 border-calm dark:text-calm-light"
                  : "text-gray-700 hover:text-calm dark:text-gray-300 dark:hover:text-calm-light"
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {theme === "light" ? (
              <>
                <Moon size={18} /> <span>Dark</span>
              </>
            ) : (
              <>
                <Sun size={18} /> <span>Light</span>
              </>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Welcome bar */}
      <div className="bg-lightbg dark:bg-gray-800 py-2 px-8 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
        Welcome, <span className="font-semibold">{username}</span>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../api";

export default function Breathing() {
  const [phase, setPhase] = useState("ready");
  const [timer, setTimer] = useState(0);
  const [duration, setDuration] = useState(1); // minutes
  const [sessions, setSessions] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await api.get("/breathing", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(res.data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      toast.error("Failed to load breathing history");
    }
  };

  const startSession = () => {
    if (isRunning) return;
    setIsRunning(true);
    setPhase("inhale");
    setTimer(duration * 60);

    let time = duration * 60;
    const phases = ["inhale", "hold", "exhale"];
    let phaseIndex = 0;

    const phaseCycle = setInterval(() => {
      setPhase(phases[phaseIndex]);
      phaseIndex = (phaseIndex + 1) % phases.length;
    }, 4000); // each phase lasts 4 seconds

    const countdown = setInterval(() => {
      time--;
      setTimer(time);
      if (time <= 0) {
        clearInterval(countdown);
        clearInterval(phaseCycle);
        setIsRunning(false);
        setPhase("done");
        saveSession();
      }
    }, 1000);
  };

  const saveSession = async () => {
    try {
      await api.post(
        "/breathing",
        { duration, type: "guided" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Session saved successfully");
      fetchSessions();
    } catch (err) {
      console.error("Error saving session:", err);
      toast.error("Failed to save session");
    }
  };

  const deleteSession = async (id) => {
    try {
      await api.delete("/breathing/${id}", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(sessions.filter((s) => s.session_id !== id));
      toast.success("Session deleted");
    } catch {
      toast.error("Failed to delete session");
    }
  };

  return (
  <div className="bg-white dark:bg-[#1e293b] text-gray-800 dark:text-gray-100 p-6 rounded-2xl shadow max-w-3xl mx-auto mt-10 text-center space-y-6">
    <h2 className="text-2xl font-semibold text-calm">Breathing Session</h2>
    <p className="text-gray-600 dark:text-gray-300">Relax and follow the guided breathing below.</p>

    {/* Duration selector */}
    <div className="flex justify-center gap-3 mt-4">
      <label className="text-gray-700 dark:text-gray-200 font-medium">Duration (minutes):</label>
      <select
        className="border p-2 rounded bg-white dark:bg-gray-800 dark:text-gray-100"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        disabled={isRunning}
      >
        {[1, 2, 3, 5, 10].map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>

    {/* Animated Circle */}
    <div className="relative flex justify-center items-center mt-10">
      <div
        className={`rounded-full bg-calm/60 transition-all duration-[4000ms] ease-in-out ${
          phase === "inhale" ? "w-64 h-64" :
          phase === "hold" ? "w-56 h-56" :
          phase === "exhale" ? "w-32 h-32" : "w-40 h-40"
        }`}
      ></div>
      <span className="absolute text-xl font-semibold text-gray-700 dark:text-gray-200">
        {phase === "inhale" && "Inhale..."}
        {phase === "hold" && "Hold..."}
        {phase === "exhale" && "Exhale..."}
        {phase === "ready" && "Ready?"}
        {phase === "done" && "Great job!"}
      </span>
    </div>

    {/* Timer */}
    {isRunning && (
      <p className="text-gray-700 dark:text-gray-300 text-lg mt-4">
        Time left: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
      </p>
    )}

    {/* Start Button */}
    <button
      onClick={startSession}
      disabled={isRunning}
      className={`px-6 py-2 rounded text-white font-medium ${
        isRunning ? "bg-gray-400 cursor-not-allowed" : "bg-calm hover:bg-calm/90"
      }`}
    >
      {isRunning ? "In Progress..." : "Start Breathing"}
    </button>

    {/* Toggle History Button */}
    <button
      onClick={() => setShowHistory(!showHistory)}
      className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 px-4 py-2 rounded mt-6 hover:bg-gray-300 dark:hover:bg-gray-600"
    >
      {showHistory ? "Hide History" : "View History"}
    </button>

    {/* Session History */}
    {showHistory && (
      <div className="mt-6 text-left">
        <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-100">Session History</h3>
        {sessions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No sessions recorded yet.</p>
        ) : (
          <ul className="divide-y divide-gray-300 dark:divide-gray-700">
            {sessions.map((s) => (
              <li key={s.session_id} className="py-2 flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-200">
                  {new Date(s.session_date).toLocaleString()} — {s.duration} min
                </span>
                <button
                  onClick={() => deleteSession(s.session_id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    )}
  </div>
);

}

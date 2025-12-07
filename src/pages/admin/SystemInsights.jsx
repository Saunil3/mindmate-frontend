import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../../api";

export default function SystemInsights() {
  const [moods, setMoods] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadMoods();
  }, []);

  const loadMoods = async () => {
    try {
      const res = await api.get("/admin/moods", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMoods(res.data);
    } catch {
        console.error("Mood fetch error:", err.response?.status, err.response?.data || err.message);
      toast.error("Failed to load moods");
    }
  };

  const deleteMood = async (id) => {
    try {
      await api.delete("/admin/mood/${id}", {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Mood deleted");
      loadMoods();
    } catch {
      toast.error("Failed to delete mood");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">System Insights (All Moods)</h2>
      {moods.length === 0 ? (
        <p className="text-gray-500">No mood data found</p>
      ) : (
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">User ID</th>
              <th className="p-2">Mood</th>
              <th className="p-2">Date</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {moods.map((m) => (
              <tr key={m.mood_id} className="border-b">
                <td className="p-2">{m.mood_id}</td>
                <td className="p-2">{m.mood_type}</td>
                <td className="p-2">
                  {new Date(m.mood_date).toLocaleDateString("en-US")}
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => deleteMood(m.mood_id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}



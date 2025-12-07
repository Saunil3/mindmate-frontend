import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../api";

export default function MoodTracker() {
  const [moods, setMoods] = useState([]);
  const [moodType, setMoodType] = useState("");
  const [note, setNote] = useState("");
  const [quoteData, setQuoteData] = useState(null);
  const [showHistory, setShowHistory] = useState(false); 
  const token = localStorage.getItem("token");

  const exerciseGifs = {
    happy: "https://media.giphy.com/media/l41lVsYDBC0UVQJCE/giphy.gif",
    neutral: "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif",
    sad: "https://media.giphy.com/media/xT8qBepJQzUjv4aU2I/giphy.gif",
    anxious: "https://media.giphy.com/media/3o7TKtdDqK9Qw8M7sM/giphy.gif",
    stressed: "https://media.giphy.com/media/l3vR3z8jvZLxKpeKk/giphy.gif",
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    try {
      const res = await api.get("/moods", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMoods(res.data);
    } catch (err) {
      console.error("Fetch moods error:", err);
    }
  };

  const handleAddMood = async () => {
    if (!moodType) return toast.error("Please select a mood.");
    try {
      await api.post("/moods",
        { mood_type: moodType, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Mood added successfully!");
      setMoodType("");
      setNote("");
      fetchMoods();
      fetchQuote(moodType); // auto-fetch quote
    } catch (err) {
      console.error("Add mood error:", err);
      toast.error("Failed to add mood.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete("/moods/${id}", {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Mood deleted!");
      fetchMoods();
    } catch (err) {
      console.error("Delete mood error:", err);
      toast.error("Failed to delete mood.");
    }
  };

  const fetchQuote = async (mood) => {
    try {
      const res = await api.get("/quotes/mood?mood=${mood}",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuoteData(res.data);
    } catch (err) {
      console.error("Quote fetch error:", err);
      setQuoteData(null);
    }
  };

  return (
    <>
      {/* MAIN CARD */}
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-2xl mx-auto mt-8 text-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Mood Tracker</h2>
          <button
            onClick={() => setShowHistory(true)}
            className="text-sm px-3 py-1 rounded-full border border-calm text-calm hover:bg-calm/10"
          >
            History
          </button>
        </div>

        {/* Mood input row */}
        <div className="flex gap-2 mb-4">
          <select
            value={moodType}
            onChange={(e) => setMoodType(e.target.value)}
            className="border p-2 rounded w-1/3"
          >
            <option value="">Select mood</option>
            <option value="happy">Happy</option>
            <option value="neutral">Neutral</option>
            <option value="sad">Sad</option>
            <option value="anxious">Anxious</option>
            <option value="stressed">Stressed</option>
          </select>
          <input
            type="text"
            placeholder="Add a short note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={handleAddMood}
            className="bg-calm text-white px-4 py-2 rounded hover:bg-calm/90"
          >
            Add
          </button>
        </div>

        {/* Motivation section stays as it is */}
        {quoteData && (
          <div className="mt-8 border-t pt-4 text-center">
            <h3 className="text-xl font-semibold text-calm mb-2">
              Motivation for You
            </h3>
            <p className="italic text-gray-700 mb-1">
              "{quoteData.quote}"
            </p>
            <p className="text-sm text-gray-500 mb-3">— {quoteData.author}</p>
            <img
              src={exerciseGifs[quoteData.mood] || exerciseGifs.neutral}
              alt="exercise gif"
              className="mx-auto rounded-xl w-64 h-64 object-cover"
            />
          </div>
        )}

        {!quoteData && (
          <p className="text-sm text-gray-500 mt-4">
            Add a mood to get a motivational quote and exercise suggestion.
          </p>
        )}
      </div>

      {/* HISTORY BACKDROP / OVERLAY */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Mood History</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-sm px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            {moods.length === 0 ? (
              <p className="text-gray-500">No moods added yet.</p>
            ) : (
              <div className="space-y-3">
                {moods.map((mood) => (
                  <div
                    key={mood.mood_id}
                    className="border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                  >
                    <div>
                      <p className="font-medium capitalize">
                        {mood.mood_type}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(mood.mood_date).toLocaleString([], {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {mood.note && (
                        <p className="text-gray-700 mt-1 text-sm">
                          {mood.note}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(mood.mood_id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm self-start sm:self-auto"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );

}

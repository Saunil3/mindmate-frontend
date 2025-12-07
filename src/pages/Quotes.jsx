import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../api";

export default function Quotes() {
  const [quoteData, setQuoteData] = useState(null);
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchQuote = async () => {
    if (!mood) return toast.error("Please select your mood first.");
    setLoading(true);
    try {
      // Add a random query param to force unique API call each time
      const res = await api.get("/quotes/mood?mood=${mood}&t=${Date.now()}",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setQuoteData(res.data);
      toast.success("Here's your motivational quote!");
    } catch (err) {
      console.error("Quote fetch error:", err);
      toast.error("Failed to fetch quote.");
    } finally {
      setLoading(false);
    }
  };

  const exerciseGifs = {
    happy: "https://media.giphy.com/media/l41lVsYDBC0UVQJCE/giphy.gif",
    neutral: "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif",
    sad: "https://media.giphy.com/media/xT8qBepJQzUjv4aU2I/giphy.gif",
    anxious: "https://media.giphy.com/media/3o7TKtdDqK9Qw8M7sM/giphy.gif",
    stressed: "https://media.giphy.com/media/l3vR3z8jvZLxKpeKk/giphy.gif",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow max-w-xl mx-auto mt-10 text-center">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Get Inspired
      </h2>

      <div className="mb-4 flex justify-center items-center space-x-2">
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="border p-2 rounded w-48"
        >
          <option value="">Select your mood</option>
          <option value="happy">Happy</option>
          <option value="neutral">Neutral</option>
          <option value="sad">Sad</option>
          <option value="anxious">Anxious</option>
          <option value="stressed">Stressed</option>
        </select>

        <button
          onClick={fetchQuote}
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-calm hover:bg-calm/90"
          } text-white px-4 py-2 rounded transition-all duration-200`}
        >
          {loading ? "Loading..." : "Inspire Me"}
        </button>
      </div>

      {quoteData && (
        <div className="mt-6 animate-fade-in">
          <p className="text-lg italic text-gray-700 mb-2">
            "{quoteData.quote}"
          </p>
          <p className="text-sm text-gray-500 mb-4">- {quoteData.author}</p>

          <img
            src={exerciseGifs[mood]}
            alt="Motivational exercise suggestion"
            className="mx-auto rounded-xl w-64 h-64 object-cover shadow-md"
          />
        </div>
      )}
    </div>
  );
}


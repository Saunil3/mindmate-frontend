import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../api";

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [content, setContent] = useState("");
  const token = localStorage.getItem("token");

  // Fetch all journal entries
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await api.get("/journals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEntries(res.data);
      } catch (err) {
        console.error("Error fetching journals:", err);
        toast.error("Failed to load journal entries");
      }
    };
    fetchEntries();
  }, [token]);

  // Add new entry
  const addEntry = async () => {
    if (!title || !content) {
      toast.error("Both title and content are required");
      return;
    }

    try {
      await api.post("/journals",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Journal added");
      setTitle("");
      setContent("");

      const res = await api.get("/journals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(res.data);
    } catch (err) {
      toast.error("Failed to add journal");
    }
  };

  // Delete entry
  const deleteEntry = async (id) => {
    try {
      await api.delete("/journals/${id}", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(entries.filter((e) => e.journal_id !== id));
      toast.success("Entry deleted");
    } catch {
      toast.error("Failed to delete entry");
    }
  };

  return (
  <div className="bg-white dark:bg-[#1e293b] text-gray-800 dark:text-gray-100 p-6 rounded-2xl shadow max-w-4xl mx-auto mt-10 transition-all duration-300">
    <h3 className="text-xl font-semibold mb-4">Journal</h3>

    <div className="mb-4 flex gap-2">
      <input
        type="text"
        placeholder="Title"
        className="border p-2 rounded w-40 dark:bg-gray-800 dark:text-gray-100"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Write your thoughts..."
        className="border p-2 rounded flex-1 dark:bg-gray-800 dark:text-gray-100"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={addEntry}
        className="bg-calm text-white px-4 rounded hover:bg-calm/90"
      >
        Add
      </button>
    </div>

    <button
      onClick={() => setShowHistory(!showHistory)}
      className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 px-4 py-2 rounded mb-4 hover:bg-gray-300 dark:hover:bg-gray-600"
    >
      {showHistory ? "Hide History" : "View History"}
    </button>

    {showHistory && (
      entries.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No journal entries yet.</p>
      ) : (
        <ul>
          {entries.map((entry) => (
            <li
              key={entry.journal_id}
              className="flex justify-between border-b border-gray-300 dark:border-gray-700 py-2 items-start"
            >
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{entry.title}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{entry.content}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(entry.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => deleteEntry(entry.journal_id)}
                className="text-red-500 hover:underline text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )
    )}
  </div>
);
}


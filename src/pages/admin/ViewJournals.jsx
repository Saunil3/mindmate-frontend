import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../../api";

export default function ViewJournals() {
  const [journals, setJournals] = useState([]);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadJournals();
  }, []);

  const loadJournals = async () => {
    try {
      const res = await api.get("/admin/journals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJournals(res.data);
    } catch (err) {
      console.error("Journal error:", err.response?.data || err.message);
      toast.error("Failed to load journals");
    }
  };

  const deleteJournal = async (id) => {
    try {
      await api.delete("/admin/journal/${id}", {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Journal deleted");
      loadJournals();
    } catch {
      toast.error("Failed to delete journal");
    }
  };

  const filteredJournals = journals.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">All Journals</h2>

      <input
        type="text"
        placeholder="Search journals..."
        className="border p-2 rounded mb-4 w-full sm:w-1/2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredJournals.length === 0 ? (
        <p className="text-gray-500">No journals found</p>
      ) : (
        <ul className="divide-y">
          {filteredJournals.map((j) => (
            <li key={j.journal_id} className="py-3 flex justify-between">
              <div>
                <p className="font-semibold">{j.title}</p>
                <p className="text-sm text-gray-600">
                  {j.content.slice(0, 100)}...
                </p>
              </div>
              <button
                onClick={() => deleteJournal(j.journal_id)}
                className="text-red-500 hover:underline text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}



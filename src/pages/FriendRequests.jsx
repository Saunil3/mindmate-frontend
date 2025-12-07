import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../api";

export default function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  // Load pending requests
  const loadRequests = async () => {
    try {
      const res = await api.get("/friends/received", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Fetch requests error:", err);
      toast.error("Failed to load requests");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      await api.post("/friends/accept/${id}", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Friend request accepted");
      loadRequests();
    } catch {
      toast.error("Failed to accept request");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post("/friends/reject/${id}", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Friend request rejected");
      loadRequests();
    } catch {
      toast.error("Failed to reject request");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Friend Requests
      </h2>

      {requests.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No pending requests.</p>
      ) : (
        <ul className="divide-y">
          {requests.map((req) => (
            <li key={req.request_id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{req.username}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{req.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(req.request_id)}
                  className="bg-calm text-white px-3 py-1 rounded hover:bg-calm/90"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(req.request_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


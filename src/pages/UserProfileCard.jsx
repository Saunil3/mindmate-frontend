import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api";

export default function UserProfileCard({ user }) {
  const [requested, setRequested] = useState(false);
  const token = localStorage.getItem("token");

  const sendFriendRequest = async () => {
    try {
      await api.post("/friends/request/${user.user_id}",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Friend request sent to ${user.username}`);
      setRequested(true);
    } catch (err) {
      toast.error("Failed to send request");
      console.error("Friend request error:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-darkBg p-4 rounded-2xl shadow-md text-center hover:shadow-lg transition">
      <img
        src={user.avatar || "/default-avatar.png"}
        alt={user.username}
        className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
      />
      <h2 className="text-xl font-semibold">{user.username}</h2>
      <p className="text-sm text-gray-500 capitalize">
        {user.gender}, {user.age} yrs
      </p>
      <p className="mt-2 text-sm italic">
        {user.about_me || "No bio yet"}
      </p>
      <div className="flex justify-center gap-4 mt-3 text-sm">
        <span>😊 {user.happy_count || 0}</span>
        <span>😢 {user.sad_count || 0}</span>
        <span>😐 {user.neutral_count || 0}</span>
      </div>

      <button
        onClick={sendFriendRequest}
        disabled={requested}
        className={`mt-4 px-4 py-2 rounded-lg text-sm font-semibold ${
          requested
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-calm text-white hover:bg-calm/90"
        }`}
      >
        {requested ? "Request Sent" : "Send Friend Request"}
      </button>
    </div>
  );
}


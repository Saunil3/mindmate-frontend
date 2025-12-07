import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../api";

export default function FriendsList() {
  const [friends, setFriends] = useState([]);
  const token = localStorage.getItem("token");

  const loadFriends = async () => {
    try {
      const res = await api.get("/friends", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends(res.data);
    } catch (err) {
      console.error("Error loading friends:", err);
      toast.error("Failed to load friends");
    }
  };

  const removeFriend = async (friendId) => {
  try {
    await api.delete("/friends/remove/${friendId}",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success("Friend removed");

    // Refresh friends list
    setFriends(friends.filter(f => f.user_id !== friendId));

  } catch (err) {
    toast.error("Failed to remove friend");
  }
};


  useEffect(() => {
    loadFriends();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Your Friends
      </h2>

      {friends.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">You have no friends yet.</p>
      ) : (
        <ul className="divide-y">
          {friends.map((friend) => (
            <li key={friend.user_id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  {friend.username}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {friend.email}
                </p>
              </div>
            <div className="flex gap-3">
              <button className="bg-calm text-white px-3 py-1 rounded">
                Message
              </button>

               <button
                  className="bg-red-500 px-4 py-1 text-white rounded"
                  onClick={() => removeFriend(friend.user_id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


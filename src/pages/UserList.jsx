import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import UserProfileCard from "./UserProfileCard";
import api from '../api";
  
export default function UserList() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/public", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error("Failed to load users");
      }
    };
    fetchUsers();
  }, [token]);

  // Send friend request
  const sendFriendRequest = async (receiverId) => {
    try {
      const res = await api.post("/friends/request/${receiverId}",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Friend request sent!");
      setSelectedUser(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
        Community Users
      </h2>

      {/* Users Grid */}
      {users.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center">
          No users found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.user_id}
              onClick={() => setSelectedUser(user)}
              className="cursor-pointer transform hover:scale-[1.02] transition-all"
            >
              <UserProfileCard user={user} />
            </div>
          ))}
        </div>
      )}

      {/* Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-[#1e293b] text-gray-800 dark:text-gray-100 rounded-2xl p-6 w-[90%] max-w-md shadow-lg relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-calm mb-4 text-center">
              {selectedUser.username}
            </h3>
            <p className="mb-2">
              <strong>Gender:</strong>{" "}
              {selectedUser.gender
                ? selectedUser.gender.charAt(0).toUpperCase() +
                  selectedUser.gender.slice(1)
                : "Not specified"}
            </p>
            <p className="mb-2">
              <strong>Age:</strong> {selectedUser.age || "Unknown"}
            </p>
            <p className="italic mb-4">
              {selectedUser.about_me
                ? `"${selectedUser.about_me}"`
                : "No bio available."}
            </p>

            {/* Mood summary */}
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-4">
              <span>😊 Happy: {selectedUser.happy_count || 0}</span>
              <span>😐 Neutral: {selectedUser.neutral_count || 0}</span>
              <span>😔 Sad: {selectedUser.sad_count || 0}</span>
            </div>

            {/* Friend request button */}
            <div className="flex justify-center">
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


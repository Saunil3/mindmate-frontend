import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;

        // Normalize DOB returned from backend (remove timestamp)
        const cleanDOB = data.dob ? data.dob.split("T")[0] : "";

        setProfile({
          ...data,
          dob: cleanDOB, // Always YYYY-MM-DD
        });

      } catch (err) {
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const cleanData = {
        ...profile,
        dob: profile.dob || null,
      };

      await api.put("/auth/update", cleanData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Profile updated");
      setEditMode(false);
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  // Timezone-safe age calculation using local date components
  const calculateAge = (dob) => {
    if (!dob) return "";
    const [year, month, day] = dob.split("-").map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // Convert YYYY-MM-DD → DD/MM/YYYY (no timezone shifting)
  const formatDOB = (dob) => {
    if (!dob) return "Not provided";
    const [y, m, d] = dob.split("-");
    return `${d}/${m}/${y}`; // 3rd option you selected
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  if (!profile.username) return <p>Loading...</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow max-w-2xl mx-auto mt-10">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-calm text-white flex items-center justify-center text-2xl font-semibold shadow-md">
          {getInitials(profile.username)}
        </div>
        <h2 className="text-2xl font-bold mt-4 text-gray-700">
          {profile.username}
        </h2>
        <p className="text-gray-500">{profile.email}</p>
      </div>

      {!editMode ? (
        <>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Gender:</strong>{" "}
              {profile.gender
                ? profile.gender.charAt(0).toUpperCase() +
                  profile.gender.slice(1)
                : "Not specified"}
            </p>

            <p>
              <strong>Date of Birth:</strong>{" "}
              {formatDOB(profile.dob)}
              {profile.dob && (
                <span className="text-gray-500 text-sm">
                  {" "}
                  ({calculateAge(profile.dob)} years)
                </span>
              )}
            </p>

            <p>
              <strong>About Me:</strong>{" "}
              {profile.about_me || "No bio added yet."}
            </p>

            <p>
              <strong>Role:</strong> {profile.role}
            </p>

            <p>
              <strong>Account Created:</strong>{" "}
              {profile.created_at
                ? new Date(profile.created_at).toLocaleDateString("en-IN", {
                    dateStyle: "medium",
                  })
                : "N/A"}
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={() => setEditMode(true)}
              className="mt-6 bg-calm text-white px-6 py-2 rounded hover:bg-calm/90 w-full transition"
            >
              Edit Profile
            </button>

            <button
              onClick={() =>
                navigate(
                  "/reset-password/b42702697aabd441786b7111cb5f16e4b51e8c6302103fd7f082f2a68476cc84"
                )
              }
              className="border border-calm text-calm px-6 py-2 rounded hover:bg-calm/10 w-full transition"
            >
              Change Password
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-4">
            <input
              type="text"
              name="username"
              value={profile.username || ""}
              onChange={handleChange}
              placeholder="Full name"
              className="border p-2 rounded w-full"
            />

            <input
              type="email"
              name="email"
              value={profile.email || ""}
              onChange={handleChange}
              placeholder="Email"
              className="border p-2 rounded w-full"
            />

            {/* DOB Input — NO timezone issues */}
            <input
              type="date"
              name="dob"
              value={profile.dob || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  dob: e.target.value, // ALWAYS YYYY-MM-DD
                })
              }
              className="border p-2 rounded w-full"
            />

            <select
              name="gender"
              value={profile.gender || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <textarea
              name="about_me"
              value={profile.about_me || ""}
              onChange={handleChange}
              placeholder="Write a short bio..."
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              className="bg-calm text-white px-6 py-2 rounded hover:bg-calm/90 w-full"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 w-full"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}


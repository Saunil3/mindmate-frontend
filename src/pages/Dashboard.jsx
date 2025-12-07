import { useEffect, useState } from "react";
import axios from "axios";
import TopNavBar from "../components/TopNavBar";
import MoodTracker from "./MoodTracker";
import Journal from "./Journal";
import Insights from "./Insights";
import Quotes from "./Quotes"; 
import Breathing from "./Breathing";
import Profile from "./Profile";
import toast from "react-hot-toast";
import UserList from "./UserList";
import FriendRequests from "./FriendRequests";
import FriendsList from "./FriendsList";
import api from "../api";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [currentSection, setCurrentSection] = useState("overview");

  // Fetch user profile when the dashboard loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Session expired. Please log in again.");
          return;
        }

        const response = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data);
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile. Please re-login.");
      }
    };

    fetchProfile();
  }, []);

  // Loading state
  if (!profile) {
    return (
      <p className="text-center mt-20 text-gray-600 dark:text-gray-300">
        Loading Dashboard...
      </p>
    );
  }

  // Custom Overview (No User Info)
  const Overview = () => (
    <div className="max-w-5xl mx-auto mt-6 text-gray-800 dark:text-gray-200">

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl mb-10">
        <h2 className="text-4xl font-extrabold text-calm dark:text-indigo-300 mb-3">
          Welcome to MindMate 👋
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
          MindMate helps you understand your emotions, track your habits, reflect through journaling, 
          and discover insights that support mental clarity and emotional wellbeing.
          It's your personal space to grow, breathe, and heal.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg hover:shadow-xl transition">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">
            Mood Tracking
          </p>
          <p className="text-3xl font-bold text-calm mt-2">
            Understand Yourself
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
            Track your mood patterns and become more aware of how you feel each day.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg hover:shadow-xl transition">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">
            Journaling
          </p>
          <p className="text-3xl font-bold text-green-500 mt-2">
            Reflect Deeply
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
            Write freely in a private, personal journal designed to help clear your mind.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg hover:shadow-xl transition">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">
            Wellness Insights
          </p>
          <p className="text-3xl font-bold text-indigo-500 mt-2">
            Discover Patterns
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
            Explore charts and visual analytics to understand your long-term emotional trends.
          </p>
        </div>

      </div>
      <div className="bg-gradient-to-r from-calm to-indigo-500 dark:from-indigo-700 dark:to-indigo-400 
                p-10 rounded-3xl shadow-xl mt-10 text-white">
              <h3 className="text-3xl font-bold mb-3">
                Need a Moment to Reset? 🌬️
              </h3>

              <p className="text-lg mb-5 opacity-90">
                Take a guided breathing session to calm your mind and slow down.
              </p>

      </div>
    </div>
  );

  // Render sections dynamically
  const renderSection = () => {
    switch (currentSection) {
      case "mood":
        return <MoodTracker />;
      case "journal":
        return <Journal />;
      case "breathing":
        return <Breathing />;
      case "insights":
        return <Insights />;
      case "profile":
        return <Profile />;
      case "users":
        return <UserList />;
      case "friendRequests":
        return <FriendRequests />;
      case "friends":
        return <FriendsList />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <TopNavBar
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        username={profile.username}
      />

      <div className="p-8 pt-28">{renderSection()}</div>
    </div>
  );
}


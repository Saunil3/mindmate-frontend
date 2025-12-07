import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto mt-10 text-gray-800 dark:text-gray-200">

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl mb-10">
        <h2 className="text-4xl font-extrabold text-calm dark:text-indigo-300 mb-3">
          Welcome to MindMate 👋
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
          MindMate helps you understand your emotions, track your moods, write freely in your journal, 
          and explore meaningful insights — all designed to support a calmer, healthier you.
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Mood Tracker */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition">
          <h3 className="text-2xl font-bold mb-3 text-calm">
            Track Your Mood 🌈
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Notice how you feel and understand your emotional patterns.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-calm text-white px-5 py-3 rounded-xl shadow hover:bg-calm/90"
          >
            Go to Mood Tracker
          </button>
        </div>

        {/* Journal */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition">
          <h3 className="text-2xl font-bold mb-3 text-indigo-400">
            Journal Your Thoughts ✍️
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            A peaceful space to write, reflect, and clear your mind.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-calm text-white px-5 py-3 rounded-xl shadow hover:bg-calm/90"
          >
            Open Journal
          </button>
        </div>

      </div>

      {/* Breathing CTA */}
      <div className="bg-gradient-to-r from-calm to-indigo-500 dark:from-indigo-700 dark:to-indigo-400 
          p-10 rounded-3xl shadow-xl mt-10 text-white">
        <h3 className="text-3xl font-bold mb-3">
          Need a Moment to Reset? 🌬️
        </h3>

        <p className="text-lg mb-5 opacity-90">
          Take a guided breathing session to calm your mind and slow down.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="bg-white text-calm px-6 py-3 rounded-xl font-bold shadow hover:bg-gray-200"
        >
          Start Breathing →
        </button>
      </div>

    </div>
  );
}

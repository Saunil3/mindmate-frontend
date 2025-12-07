import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../api";
import { Bar, Line, Doughnut, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale
);

export default function Insights() {
  const [insights, setInsights] = useState([]);
  const [moods, setMoods] = useState([]);
  const [filteredInsights, setFilteredInsights] = useState([]);
  const [filteredMoods, setFilteredMoods] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weekStart, setWeekStart] = useState("");
  const [summary, setSummary] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await api.get("/insights", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInsights(res.data);
        setFilteredInsights(res.data);
      } catch {
        toast.error("Unable to load insights");
      }
    };
    fetchInsights();
  }, [token]);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await api.get("/moods", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMoods(res.data);
        setFilteredMoods(res.data);
      } catch (err) {
        console.error("Error loading moods:", err);
      }
    };
    fetchMoods();
  }, [token]);

  useEffect(() => {
    if (startDate && endDate) {
      const filteredI = insights.filter((i) => {
        const date = new Date(i.week_start);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
      const filteredM = moods.filter((m) => {
        const date = new Date(m.mood_date);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
      setFilteredInsights(filteredI);
      setFilteredMoods(filteredM);
    } else {
      setFilteredInsights(insights);
      setFilteredMoods(moods);
    }
  }, [startDate, endDate, insights, moods]);

  const addInsight = async () => {
    if (!weekStart || !summary) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await api.post("/insights",
        { week_start: weekStart, summary },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Insight added");
      setWeekStart("");
      setSummary("");
      const res = await api.get("/insights", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInsights(res.data);
    } catch {
      toast.error("Failed to add insight");
    }
  };

  const deleteInsight = async (id) => {
    try {
      await api.delete("/insights/${id}", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInsights(insights.filter((i) => i.insight_id !== id));
      toast.success("Insight deleted");
    } catch {
      toast.error("Failed to delete insight");
    }
  };

  const moodMap = { happy: 5, neutral: 3, sad: 2, anxious: 2, stressed: 1 };

  const moodCounts = filteredMoods.reduce((acc, mood) => {
    acc[mood.mood_type] = (acc[mood.mood_type] || 0) + 1;
    return acc;
  }, {});

  const groupedByDate = {};
  filteredMoods.forEach((mood) => {
    const day = new Date(mood.mood_date).toLocaleDateString("en-US");
    if (!groupedByDate[day]) groupedByDate[day] = [];
    groupedByDate[day].push(moodMap[mood.mood_type] || 0);
  });

  const dailyScores = Object.entries(groupedByDate)
    .map(([date, scores]) => ({
      date,
      avg: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const barData = {
    labels: Object.keys(moodCounts),
    datasets: [
      {
        label: "Mood Frequency",
        data: Object.values(moodCounts),
        backgroundColor: ["#22c55e", "#a3a3a3", "#3b82f6", "#f97316", "#ef4444"],
      },
    ],
  };

  const pieData = {
    labels: Object.keys(moodCounts),
    datasets: [
      {
        data: Object.values(moodCounts),
        backgroundColor: ["#22c55e", "#a3a3a3", "#3b82f6", "#f97316", "#ef4444"],
      },
    ],
  };

  const lineData = {
    labels: dailyScores.map((d) => d.date),
    datasets: [
      {
        label: "Daily Wellness Score",
        data: dailyScores.map((d) => d.avg),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, min: 0, max: 5 },
      x: { ticks: { autoSkip: true, maxTicksLimit: 8 } },
    },
  };

 
  const radarData = {
  labels: ["Happy", "Neutral", "Sad", "Anxious", "Stressed"],
  datasets: [
    {
      label: "Mood Balance",
      data: [
        moodCounts.happy || 0,
        moodCounts.neutral || 0,
        moodCounts.sad || 0,
        moodCounts.anxious || 0,
        moodCounts.stressed || 0
      ],
      backgroundColor: "rgba(99, 102, 241, 0.2)",
      borderColor: "rgba(99, 102, 241, 1)",
      borderWidth: 2,
      pointBackgroundColor: "rgba(99, 102, 241, 1)",
      pointBorderColor: "#fff",
      pointRadius: 4,
    },
  ],
};

  const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      pointLabels: {
        display: true,
        font: {
          size: 12,
        },
        padding: 20,  
      },
      ticks: { display: false },
      suggestedMin: 0,
      suggestedMax: Math.max(
        moodCounts.happy || 1,
        moodCounts.neutral || 1,
        moodCounts.sad || 1,
        moodCounts.anxious || 1,
        moodCounts.stressed || 1
      ),
      grid: { color: "#ccc" },
      angleLines: { color: "#ddd" },
    },
  },
};


  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-8">
      <h3 className="text-xl font-semibold">Wellness Insights</h3>

      {/* Add Insight */}
      <div className="flex gap-2 mb-4">
        <input
          type="date"
          className="border p-2 rounded w-40"
          value={weekStart}
          onChange={(e) => setWeekStart(e.target.value)}
        />
        <input
          type="text"
          placeholder="Weekly reflection..."
          className="border p-2 rounded flex-1"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <button
          onClick={addInsight}
          className="bg-calm text-white px-4 rounded hover:bg-calm/90"
        >
          Add
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-3 items-center mb-6">
        <span className="text-gray-700 font-medium">Filter by Date Range:</span>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
          }}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          Clear
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md flex justify-center">
          <div className="max-w-sm w-full">
            <h4 className="text-lg font-semibold mb-4 text-center">Mood Distribution</h4>
            <Bar data={barData} options={options} height={200} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md flex justify-center">
          <div className="max-w-xs w-full">
            <h4 className="text-lg font-semibold mb-4 text-center">Mood Percentage</h4>
            <Doughnut data={pieData} width={200} height={200} />
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md flex justify-center">
          <div className="w-64 h-64 md:w-80 md:h-80">
            <h4 className="text-lg font-semibold mb-4 text-center">Mood Balance</h4>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>


        {/* Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md flex justify-center md:col-span-2">
          <div className="max-w-2xl w-full">
            <h4 className="text-lg font-semibold mb-4 text-center">Wellness Score Trend</h4>
            <Line data={lineData} options={options} height={180} />
          </div>
        </div>

      </div>

      {/* Reflections */}
      {filteredInsights.length > 0 ? (
        <div className="bg-calm/10 p-4 rounded-lg mt-6">
          <h4 className="font-semibold text-gray-700 mb-2">Weekly Reflections</h4>
          {filteredInsights.map((item) => (
            <p
              key={item.insight_id}
              className="text-gray-600 italic border-b border-gray-200 pb-2 mb-2"
            >
              {new Date(item.week_start).toLocaleDateString("en-US")}:{" "}
              {item.summary}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-6">No reflections for this range.</p>
      )}
    </div>
  );
}


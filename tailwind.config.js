/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // enables dark mode using the 'dark' class
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        calm: "#6366f1",       // Indigo (brand primary)
        calmLight: "#f8fafc",  // Soft Lavender Light Background

        // Soft Calm Dark Mode Backgrounds
        darkBg: "#0f172a",     // Gray-900
        darkBg2: "#1F2937",    // Gray-800
        darkCard: "#1E2533",   // Slightly blue-tinted soft calm card bg
      },
    },
  },
  plugins: [],
};
 
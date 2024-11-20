/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#141B1B",
        orange: "#00FF00", // Vert vif pour tester
      },
    },
  },
  plugins: [],
};

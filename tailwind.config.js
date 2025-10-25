/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: "#0F4D3B",
        greenLight: "#126C52",
        // purple: "#401346",
        // purple: "#f0c2fe",
        background: "#1b1d21",
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        dark: "#1b1d21",
      },
      fontFamily: {
        fredoka: ["Fredoka"],
        kanit: ["Kanit-Regular"],
        "kanit-thin": ["Kanit-Thin"],
        "kanit-light": ["Kanit-Light"],
        "kanit-medium": ["Kanit-Medium"],
        "kanit-semibold": ["Kanit-SemiBold"],
        "kanit-bold": ["Kanit-Bold"],
        "kanit-extrabold": ["Kanit-ExtraBold"],
        "kanit-black": ["Kanit-Black"],
      },
    },
  },
  plugins: [],
};

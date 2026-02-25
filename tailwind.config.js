/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7B9E87",
        "primary-light": "#A8C4B2",
        "primary-dark": "#5A7B65",
        secondary: "#4D5E53",
        tertiary: "#EDF2EE",
        fond: "#F8FAF8",
        accent: {
          DEFAULT: "#7B9E87",
          light: "#A8C4B2",
        },
        background: "#F8FAF8",
        surface: "#EDF2EE",
        elevated: "#FFFFFF",
        gray: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
      fontFamily: {
        fredoka: ["Fredoka"],
        nunito: ["Nunito-Regular"],
        "nunito-extralight": ["Nunito-ExtraLight"],
        "nunito-light": ["Nunito-Light"],
        "nunito-medium": ["Nunito-Medium"],
        "nunito-semibold": ["Nunito-SemiBold"],
        "nunito-bold": ["Nunito-Bold"],
        "nunito-extrabold": ["Nunito-ExtraBold"],
        "nunito-black": ["Nunito-Black"],
      },
    },
  },
  plugins: [],
};

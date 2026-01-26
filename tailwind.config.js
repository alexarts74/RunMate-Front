/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Couleurs du design sportif
        primary: "#F97316", // Orange sportif
        secondary: "#525252", // Gris neutre
        tertiary: "#F5F5F5", // Gris clair
        fond: "#FFFFFF", // Fond blanc
        accent: {
          DEFAULT: "#F97316",
          light: "#FFF7ED",
        },
        // Anciennes couleurs conservées pour compatibilité
        green: "#0F4D3B",
        greenLight: "#126C52",
        background: "#1b1d21",
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
        dark: "#1b1d21",
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

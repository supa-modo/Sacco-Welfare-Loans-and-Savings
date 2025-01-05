/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#059669",
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#059669",
          600: "#047857",
          700: "#065f46",
          800: "#064e3b",
          900: "#064e3b",
        },
      },
      fontFamily: {
        geist: ["Geist", "sans-serif"],
        "nunito-sans": ["Nunito Sans", "sans-serif"],
        "open-sans": ["Open Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

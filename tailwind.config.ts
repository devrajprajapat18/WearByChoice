/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#0e0e11",
        cream: "#faf9f7",
        accent: "#c8f04a"
      },
      borderRadius: { xl2: "1.25rem" },
      fontFamily: { display: ["Inter", "system-ui", "sans-serif"] }
    }
  },
  plugins: []
};

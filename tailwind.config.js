/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css}",
  ],
  theme: {
    extend: {
      colors: {
        "pink-soft": "#f8c8dc",
        "rose": "#e8a0b8",
        "lavender": "#d8b4e2",
        "warm-white": "#faf8f5",
        "dark-luxury": "#1a1a2e",
        "gold-accent": "#d4af37",
        "deep-black": "#0d0d0d",
        "elegant-white": "#f5f0eb",
        "starlight-glow": "#fffbe6",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

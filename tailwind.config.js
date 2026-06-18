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
        'pink-soft': '#F8BBD0',
        'rose': '#E91E63',
        'lavender': '#E6E6FA',
        'warm-white': '#FDF5E6',
        'dark-luxury': '#1A1A1A',
        'gold-accent': '#D4AF37',
        'deep-black': '#0A0A0A',
        'elegant-white': '#F8F6F3',
        'starlight-glow': '#FFF8DC',
      },
      screens: {
        'xs': '320px',
        'sm': '375px',
        'ms': '390px',
        'ml': '414px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

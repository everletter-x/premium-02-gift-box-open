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
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.37)',
        'glass-lg': '0 24px 80px rgba(0, 0, 0, 0.4)',
        'glow-soft': '0 0 60px rgba(197, 179, 230, 0.15)',
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};

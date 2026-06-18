export const themeTokens = {
  premium: {
    pinkSoft: '#F8BBD0',
    rose: '#E91E63',
    lavender: '#E6E6FA',
    warmWhite: '#FDF5E6',
  },
  ultra: {
    darkLuxury: '#1A1A1A',
    goldAccent: '#D4AF37',
    deepBlack: '#0A0A0A',
    elegantWhite: '#F8F6F3',
    starlightGlow: '#FFF8DC',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
    },
  },
};

export function getThemeClasses(theme: string): { bg: string; text: string; accent: string } {
  const themes: Record<string, { bg: string; text: string; accent: string }> = {
    pink: { bg: 'bg-pink-50', text: 'text-gray-900', accent: 'text-rose' },
    rose: { bg: 'bg-rose-50', text: 'text-gray-900', accent: 'text-rose' },
    lavender: { bg: 'bg-purple-50', text: 'text-gray-900', accent: 'text-purple-600' },
    'warm-white': { bg: 'bg-orange-50', text: 'text-gray-900', accent: 'text-orange-600' },
    'dark-luxury': { bg: 'bg-[#1A1A1A]', text: 'text-[#F8F6F3]', accent: 'text-[#D4AF37]' },
    'gold-accent': { bg: 'bg-black', text: 'text-[#F8F6F3]', accent: 'text-[#D4AF37]' },
  };
  return themes[theme] || themes.pink;
}

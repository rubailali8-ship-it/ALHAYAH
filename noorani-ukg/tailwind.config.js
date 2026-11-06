/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '"Hind Siliguri"', 'system-ui', 'sans-serif'],
        bn: ['"Hind Siliguri"', 'Inter', 'sans-serif'],
        ar: ['Amiri', 'serif'],
      },
      colors: {
        cream: '#FBF8F3',
        ink: '#1F2A37',
        muted: '#4B5563',
        sage: { 50: '#F1F7F3', 100: '#DCEDE2', 200: '#BCDCC7', 600: '#2F6B4A', 700: '#24553A' },
        sky: { 50: '#EFF6FB', 100: '#D9EAF5', 600: '#245E86' },
        peach: { 50: '#FDF3EC', 100: '#FAE2D2', 600: '#9A4A1C' },
        lilac: { 50: '#F5F2FB', 100: '#E7E0F5', 600: '#5B3F94' },
        sun: { 50: '#FEF9E8', 100: '#FCEFC2', 600: '#7A5A00' },
      },
      borderRadius: { xl2: '1.25rem' },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDF9F0',
          100: '#FAF0D7',
          200: '#F5E1AF',
          300: '#E8C97A',
          400: '#D4A94A',
          500: '#C4943A',
          600: '#A87530',
          700: '#8A5C28',
          800: '#6E4923',
          900: '#5A3B1F',
        },
        diamond: {
          50: '#F0F8FF',
          100: '#E0F0FF',
          200: '#B8E0FF',
          300: '#7CC4FF',
          400: '#36A8FF',
          500: '#0B8CFF',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

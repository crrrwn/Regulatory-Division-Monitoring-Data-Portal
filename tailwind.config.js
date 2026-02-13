/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        /* From public/theme.css (COLOR THEME palette) - hex so opacity modifiers work */
        primary: {
          DEFAULT: '#1e4d2b',
          light: '#4a6b3c',
          dark: '#153019',
        },
        muted: '#5c7355',
        accent: {
          DEFAULT: '#b8a066',
          light: '#d4c4a0',
        },
        surface: '#e8e0d4',
        background: '#faf8f5',
        border: '#d4cdc0',
        'text-muted': '#5c574f',
        /* theme.css neutrals */
        'content': '#2d2a26',
      },
    },
  },
  plugins: [],
}

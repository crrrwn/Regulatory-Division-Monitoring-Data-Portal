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
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- Add this line!
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#642FCD',
        lavender: '#DCCCF7',
        berry: '#8D2E6E',
      },
    },
  },
  plugins: [],
}
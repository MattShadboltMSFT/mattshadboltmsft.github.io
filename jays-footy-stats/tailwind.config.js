/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'afl-red': '#E21837',
        'grass-green': '#2C7A3D',
        'achievement-gold': '#FFB81C',
      },
    },
  },
  plugins: [],
}

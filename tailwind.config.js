/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
  './pages/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  './app/**/*.{ts,tsx}',
  './screens/**/*.{ts,tsx}',
],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        'primary':'#15203e',
        'secondary':'#55aac4',
      }
    },
  },
  plugins: [],
}
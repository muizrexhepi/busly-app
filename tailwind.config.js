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
        'primary':'#080e2c',
        'secondary':'#43eaba'
      }
    },
  },
  plugins: [],
}
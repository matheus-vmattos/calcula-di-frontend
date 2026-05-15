/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Paleta Apple-clean
        background: '#FFFFFF',
        surface: '#F5F5F7',
        primary: '#000000',
        'text-primary': '#1D1D1F',
        'text-secondary': '#86868B',
        'text-tertiary': '#AEAEB2',
        border: '#D2D2D7',
        success: '#34C759',
        danger: '#FF3B30',
      },
      fontFamily: {
        sans: ['System'], // usa San Francisco no iOS, Roboto no Android
      },
    },
  },
  plugins: [],
};
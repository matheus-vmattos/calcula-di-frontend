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
        background: '#FFFFFF',
        surface: '#F5F5F7',
        'surface-elevated': '#FAFAFA',
        primary: '#000000',
        'primary-inverse': '#FFFFFF',
        'text-primary': '#1D1D1F',
        'text-secondary': '#86868B',
        'text-tertiary': '#AEAEB2',
        border: '#D2D2D7',
        divider: '#E5E5EA',
        success: '#34C759',
        warning: '#FF9500',
        danger: '#FF3B30',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
        'xl': '20px',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
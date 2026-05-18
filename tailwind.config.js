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
        // Fundos (paleta prata)
        background: '#FAFAFB',
        surface: '#F2F2F4',
        'surface-elevated': '#E8E8EB',

        // Acento principal (grafite metálico — substitui o preto)
        primary: '#1C1C1E',
        'primary-inverse': '#FAFAFA',

        // Textos
        'text-primary': '#1C1C1E',
        'text-secondary': '#6E6E73',
        'text-tertiary': '#A1A1A6',

        // Estrutura (bordas mais sutis, prateadas)
        border: '#D6D6D9',
        divider: '#E8E8EB',

        // Semânticos
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
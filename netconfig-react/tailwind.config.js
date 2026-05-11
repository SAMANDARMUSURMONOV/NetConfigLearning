/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        electric: '#00b4ff',
        'brand-cyan': '#1de9b6',
        dark: {
          950: '#050a14',
          900: '#0a1428',
          800: '#131c31',
          700: '#1e293b'
        }
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite'
      }
    },
  },
  plugins: [],
}

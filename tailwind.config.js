/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'system': ['SF Pro Display', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        'homeos-blue': '#0078d4',
        'homeos-dark': '#1a1a1a',
        'homeos-light': '#f5f5f5',
      }
    },
  },
  plugins: [],
}

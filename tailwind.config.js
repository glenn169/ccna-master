/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#07101f', 900: '#0f172a', 800: '#172033' },
        cyan: { 400: '#22d3ee', 500: '#06b6d4' }
      },
      boxShadow: { soft: '0 14px 35px -18px rgba(15, 23, 42, 0.28)' }
    }
  },
  plugins: []
}

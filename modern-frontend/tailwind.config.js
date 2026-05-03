/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        accent:  '#8b5cf6',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':  'spin 3s linear infinite',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

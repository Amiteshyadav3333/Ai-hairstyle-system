/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00f5ff',
          purple: '#bf00ff',
          pink: '#ff0080',
          green: '#00ff88'
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        'pulse-neon': {
          '0%': { boxShadow: '0 0 5px #00f5ff, 0 0 10px #00f5ff, 0 0 15px #00f5ff' },
          '100%': { boxShadow: '0 0 10px #00f5ff, 0 0 20px #00f5ff, 0 0 30px #00f5ff' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'glow': {
          '0%': { textShadow: '0 0 5px #00f5ff' },
          '100%': { textShadow: '0 0 20px #00f5ff, 0 0 30px #00f5ff' }
        }
      }
    },
  },
  plugins: [],
}
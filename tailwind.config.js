/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow-sm': '0 0 10px 2px rgba(255,255,255,0.8)',
        'glow-md': '0 0 15px 5px rgba(255,255,255,0.8)',
        'glow-lg': '0 0 20px 10px rgba(255,255,255,0.8)',
        'glow-xl': '0 0 25px 15px rgba(255,255,255,0.8)',
        'glow-blue': '0 0 20px 10px rgba(76,111,255,0.6)',
      },
      keyframes: {
        bulbPulse: {
          '0%, 100%': { 
            opacity: '1', 
            transform: 'scale(1)',
            boxShadow: '0 0 15px 5px rgba(255,255,255,0.8)'
          },
          '50%': { 
            opacity: '0.7', 
            transform: 'scale(0.95)',
            boxShadow: '0 0 25px 15px rgba(255,255,255,0.8)'
          },
        },
        wheelSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        glow: {
          '0%, 100%': { 
            opacity: '1',
            boxShadow: '0 0 20px 10px rgba(76,111,255,0.6)'
          },
          '50%': { 
            opacity: '0.8',
            boxShadow: '0 0 30px 15px rgba(76,111,255,0.8)'
          },
        }
      },
      animation: {
        'bulb-pulse': 'bulbPulse 2s ease-in-out infinite',
        'wheel-spin': 'wheelSpin 10s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#142420',
        teal: {
          50: '#EEF5F3',
          100: '#D8E9E4',
          200: '#A9CFC5',
          300: '#75AFA0',
          400: '#3F8472',
          500: '#1F6856',
          600: '#155343',
          700: '#0F3D38',
          800: '#0B2C29',
          900: '#081E1C'
        },
        sand: {
          50: '#F9F8F4',
          100: '#F1EEE5',
          200: '#E3DDCB'
        },
        gold: {
          400: '#D9A441',
          500: '#C2912F',
          600: '#A87823'
        },
        coral: {
          400: '#E0795F',
          500: '#D2603F'
        }
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', '"Noto Sans Ethiopic"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      borderRadius: {
        arch: '999px 999px 12px 12px'
      },
      boxShadow: {
        soft: '0 8px 30px -12px rgba(15, 61, 56, 0.25)'
      }
    }
  },
  plugins: []
};

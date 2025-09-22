/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/**/*.html',
    './static/js/**/*.js',
    './*/templates/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        'cyblime-teal': '#20B2AA',
        'cyblime-turquoise': '#40E0D0',
        'cyblime-orange': '#FF8C00',
        'cyblime-dark': '#111827',
        'cyblime-primary': '#20B2AA',
        'cyblime-accent': '#FF8C00',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        slideUp: {
          from: { 
            opacity: '0', 
            transform: 'translateY(30px)' 
          },
          to: { 
            opacity: '1', 
            transform: 'translateY(0)' 
          }
        }
      }
    },
  },
  plugins: [],
}
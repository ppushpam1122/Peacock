/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Montserrat', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        hop: {
          red:      '#C41E1E',
          'red-dark': '#A01818',
          'red-light': '#D93030',
          black:    '#111111',
          grey:     '#F2F2F2',
          'grey-mid': '#E0E0E0',
          'grey-dark': '#888888',
        },
      },
      boxShadow: {
        card:        '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover':'0 6px 24px rgba(0,0,0,0.14)',
        modal:       '0 20px 60px rgba(0,0,0,0.2)',
      },
      animation: {
        'fade-up':  'fadeUp 0.5s ease forwards',
        'fade-in':  'fadeIn 0.3s ease forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        fadeUp:  { '0%': { opacity:'0', transform:'translateY(16px)' }, '100%': { opacity:'1', transform:'translateY(0)' } },
        fadeIn:  { '0%': { opacity:'0' }, '100%': { opacity:'1' } },
        slideUp: { '0%': { opacity:'0', transform:'translateY(24px)' }, '100%': { opacity:'1', transform:'translateY(0)' } },
      },
    },
  },
  plugins: [],
};

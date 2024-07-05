/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xsx': '940px',
      },
      colors: {
        'custom-back-grey': '#6d5700e7',
        'custom-blue': '#001433',
      },
      fontSize: {
        'custom-sz': '25px',

        'custom-size': '20px',
      },
      boxShadow: {
        'custom-light': '0px 0px 2px rgb(0, 30, 65)',
        'custom-card': '0px 0px 9px rgba(76, 76, 76, 0.718)',
        'custom-lighter': '0px 0px 3px rgb(255,255,255 )',
      },
      keyframes: {
        skewAnim: {
          '0%': { transform: 'skew(15deg)' },
          '50%': { transform: 'skew(45deg)' },
          '100%': { transform: 'skew(15deg)' },
        },
      },
      animation: {
        skewAnim: 'skewAnim 2s infinite linear',
      },
    },
  },
  variants: {
    scrollbar: ['rounded'],
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('tailwind-scrollbar'),
  ],

}


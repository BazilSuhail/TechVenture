/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: { 
      backgroundImage: {
        'gradient-gray': 'linear-gradient(-45deg, #e0e0e0, #f5f5f5, #e0e0e0)',
      },
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
        'custom-slider': '0px 0px 15px rgb(0, 30, 65)',
        'custom-shadow': '0px 0px 8px rgb(0, 30, 65,0.45)',
        'custom-card': '0px 0px 9px rgba(76, 76, 76, 0.718)',
        'custom-lighter': '0px 0px 5px rgb(255, 255, 255, 0.655 )',
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


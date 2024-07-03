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
        'custom-back-grey':'#6d5700e7', 
        'custom-blue': '#001433',
      },
      fontSize: {
        'custom-sz': '25px',
        
        'custom-size': '20px',
      },
      boxShadow: {
        'custom-light': '0px 0px 2px rgb(0, 30, 65)',
        'custom-lighter': '0px 0px 3px rgb(255,255,255 )',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
  
}


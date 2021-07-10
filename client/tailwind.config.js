module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors:{
        thyme:{
          lightest:'#F1FFFA',
          light:'#CCFCCB',
          DEFAULT:'#96E6B3',
          dark:'#568259',
          darkest:'#464E47',
          000:'#F1FFFA',
          100:'#DFFEE3',
          200:'#CCFCCB',
          300:'#B1F1BF',
          400:'#96E6B3',
          500:'#76B486',
          600:'#568259',
          700:'#4E6850',
          800:'#464E47',
          900:'#575E58',
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

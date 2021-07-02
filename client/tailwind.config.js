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
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

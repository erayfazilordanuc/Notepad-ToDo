/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './src/App.{js,jsx,ts,tsx}',
    './src/components/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        rubik: ['Rubik-Regular', 'sans-serif'],
        'rubik-bold': ['Rubik-Bold', 'sans-serif'],
        'rubik-extrabold': ['Rubik-ExtraBold', 'sans-serif'],
        'rubik-medium': ['Rubik-Medium', 'sans-serif'],
        'rubik-semibold': ['Rubik-SemiBold', 'sans-serif'],
        'rubik-light': ['Rubik-Light', 'sans-serif'],
      },
      colors: {
        primary: {
          100: '#0061FF0A',
          200: '#0061FF1A',
          212: '#90BAFF',
          219: '#7aadff',
          225: '#71A7FF',
          250: '#5A99FF',
          300: '#0061FF',
        },
        gray: {500: '#6b7280', 700: '#374151'},
        blue: {
          10: '#FAFFFF',
        },
        accent: {
          100: '#FBFBFD',
        },
        black: {
          DEFAULT: '#000000',
          100: '#8C8E98',
          200: '#666876',
          300: '#191D31',
        },
        danger: '#F75555',
      },
    },
  },
  plugins: [],
};

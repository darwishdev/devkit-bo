/** @type {import('tailwindcss').Config} */
const primeui = require('tailwindcss-primeui');
export default {
  content: [
    "./index.html",
    "./formkit.theme.ts",
    "./formkit.config.ts",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1920px'
    }
  },
  darkMode: ['selector', '[class*="my-app-dark"]'],
  plugins: [primeui],
}

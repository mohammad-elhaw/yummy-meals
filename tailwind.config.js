/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    screens: {
      'sm': '600px',
      'md': '720px',
      'lg': '900px',
      'xl': '1100px',
      '2xl': '1340px',
    },
    container: {
      center: true,
    },
    extend: {},
  },
  plugins: [],
}


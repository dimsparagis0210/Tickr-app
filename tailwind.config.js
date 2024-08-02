/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./Components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
        backgroundImage: theme => ({
          'mySky': "url('/public/bg.png')",
        }),
    },
  },
  plugins: [],
}

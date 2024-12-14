/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/html/**/*.{html,js}", "./public/index.html"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}


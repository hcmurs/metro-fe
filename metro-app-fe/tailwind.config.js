/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      'xs': '400px',         // Custom breakpoint nhỏ hơn sm
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1370px',
      '2xl': '1536px',
      '3xl': '1920px',       // Custom thêm breakpoint lớn
    },
  },
  plugins: [],
}

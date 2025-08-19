/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '300px',
      'md': '842px',
      'lg': '1024px',
      'xl': '1370px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {}, // có thể để rỗng, không bắt buộc
  },
  plugins: [],
}

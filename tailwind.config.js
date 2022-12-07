/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    data: {
      checked: 'state~="checked"',
      unchecked: 'state~="unchecked"',
    },
    fontFamily: {
      poppins: ["var(--font-poppins)"],
    },
    extend: {},
  },
  plugins: [],
};

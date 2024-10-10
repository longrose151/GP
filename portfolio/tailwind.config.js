/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      gridTemplateColumns: {
        '70/30': '70% 28%',
      },
      colors: {
        'dark-blue': '#0B1354',  // Keep dark blue as main background
        'beige': '#F4C46C',      // Beige for highlights (buttons, headers)
        'light-beige': '#F9D79D', // Use this sparingly for backgrounds (form, footer)
        'blue': '#1D3461',       // Blue for button text or small details
        'white': '#FFFFFF',      // White for text and form backgrounds
        'gray': '#F2F2F2',       // Light gray for hover effects, backgrounds, etc.
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  // tell Tailwind which files contain classes so it can generate the utilities
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


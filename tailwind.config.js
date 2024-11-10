const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Include all source files for Tailwind scanning
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}", // Include NextUI theme files for Tailwind scanning
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
}
// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "hue-rotate-0",
    "hue-rotate-20",
    "hue-rotate-125",
    "hue-rotate-145",
    "hue-rotate-195",
    "hue-rotate-225",
    "hue-rotate-255",
    "hue-rotate-280",
    "hue-rotate-305",
    "hue-rotate-335",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    colors: {
      current: "currentColor",

      primary: "#ee5533",
      secondary: "#f79122",
      highlight: "#ffcc00",

      "gray-dark": "#1f2429",
      gray: "#3d4752",
      TODO: "#596572",
      "gray-light": "#6f7984",
      TODO2: "#d3dce5",
      white: "#eef2f7",

      green: "#66cc22",
    },
    fontFamily: {
      header: [
        "Raleway",
        '"Helvetica Neue"',
        "Roboto",
        '"Arial Nova"',
        '"Segoe UI"',
        '"Ubuntu Light"',
        "sans-serif",
      ],
      sans: [
        "Roboto",
        '"Helvetica Neue"',
        '"Arial Nova"',
        '"Segoe UI"',
        '"Ubuntu Light"',
        "sans-serif",
      ],
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};

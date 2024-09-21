/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enable dark mode using a CSS class
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ffffff",
        secondary: "#382f9c",
        accent: "#fcf2c1",
        danger: "#b82f27",
        darkDanger: "#a22821",
        darkBg: "#121212", // Add a background color for dark mode
        darkSecondary: "#1f1b6f", // Dark mode version of secondary color
      },
      fontFamily: {
        robotoFlex: "Roboto Flex",
        islandMoments: "Island Moments",
        abhaya: "Abhaya Libre",
        Lato: "Lato",
      },
      container: {
        center: true,
      },
    },
  },
  plugins: [],
};

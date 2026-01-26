// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
        colors: {
            primary: "rgb(var(--color-primary) / <alpha-value>)",
            text: "rgb(var(--color-text) / <alpha-value>)",
            success: "rgb(var(--color-success) / <alpha-value>)",
            info: "rgb(var(--color-info) / <alpha-value>)",
            warn: "rgb(var(--color-warn) / <alpha-value>)",
            error: "rgb(var(--color-error) / <alpha-value>)",
            transparent: "transparent",
            current: "currentColor",
        },
    },
  },
  plugins: [],
}
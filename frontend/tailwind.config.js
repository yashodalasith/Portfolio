/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0E1420",
        "ink-raised": "#151D2E",
        amber: "#F2A65A",
        cyan: "#5EEAD4",
        violet: "#8B7FD1",
        bone: "#EDEEF0",
        slate: "#8A94A6",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

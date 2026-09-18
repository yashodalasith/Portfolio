/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--color-ink-rgb) / <alpha-value>)",
        "ink-raised": "rgb(var(--color-ink-raised-rgb) / <alpha-value>)",
        amber: "rgb(var(--color-amber-rgb) / <alpha-value>)",
        cyan: "rgb(var(--color-cyan-rgb) / <alpha-value>)",
        violet: "rgb(var(--color-violet-rgb) / <alpha-value>)",
        bone: "rgb(var(--color-bone-rgb) / <alpha-value>)",
        slate: "rgb(var(--color-slate-rgb) / <alpha-value>)",
        line: "var(--color-line)",
        "line-soft": "var(--color-line-soft)",
        "line-strong": "var(--color-line-strong)",
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

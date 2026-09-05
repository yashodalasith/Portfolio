/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        "ink-raised": "var(--color-ink-raised)",
        amber: "var(--color-amber)",
        cyan: "var(--color-cyan)",
        violet: "var(--color-violet)",
        bone: "var(--color-bone)",
        slate: "var(--color-slate)",
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

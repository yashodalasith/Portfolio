import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// Reads the theme already set by the pre-paint script in index.html, then
// lets the visitor override it. The explicit choice is persisted and wins
// over the system preference from then on.
export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      // Private browsing / storage disabled — theme still works for this
      // session, it just won't persist across visits.
    }
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line text-slate transition-colors hover:border-cyan hover:text-cyan"
    >
      <Sun
        size={17}
        className={`absolute transition-all duration-300 ${
          theme === "dark" ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      />
      <Moon
        size={17}
        className={`absolute transition-all duration-300 ${
          theme === "dark" ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      />
    </button>
  );
}

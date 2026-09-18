import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: change "portfolio" below to your actual GitHub repo name.
// GitHub Pages serves project sites from https://<user>.github.io/<repo>/,
// so Vite needs to know that sub-path when building asset URLs.
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/Portfolio/" : "/",
});

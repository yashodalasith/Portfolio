import { useRef } from "react";
import { useReducedMotion } from "framer-motion";

// Combines two free, code-only techniques into one consistent "interactive
// card" language: a CSS 3D tilt toward the cursor (Layer 1 — near-zero
// cost) and a radial spotlight that follows the pointer (Layer 2 — a CSS
// custom-property + gradient, no canvas). Spread the returned props onto
// the card's root element; render <SpotlightOverlay /> as its first child
// (the card needs `relative overflow-hidden` for the glow to clip to its
// rounded corners). Tilt is skipped under prefers-reduced-motion; the
// spotlight glow stays, since a static highlight isn't disorienting motion.
export function useTiltSpotlight({ tiltDegrees = 6, radius = 320 } = {}) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ref.current.style.setProperty("--spot-x", `${x}px`);
    ref.current.style.setProperty("--spot-y", `${y}px`);

    if (!reduceMotion) {
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;
      ref.current.style.transform = `perspective(900px) rotateX(${py * -tiltDegrees}deg) rotateY(${px * tiltDegrees}deg)`;
    }
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };

  return {
    ref,
    radius,
    handlers: {
      onMouseMove: handleMove,
      onMouseLeave: handleLeave,
    },
  };
}

export function SpotlightOverlay({ radius = 320 }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background: `radial-gradient(${radius}px circle at var(--spot-x, 50%) var(--spot-y, 50%), var(--color-cyan) 0%, transparent 70%)`,
        mixBlendMode: "soft-light",
      }}
    />
  );
}

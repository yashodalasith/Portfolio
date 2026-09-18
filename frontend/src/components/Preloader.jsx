import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const BOOT_STAGES = [
  { at: 0, label: "booting portfolio" },
  { at: 25, label: "compiling profile" },
  { at: 55, label: "loading projects" },
  { at: 85, label: "linking systems" },
  { at: 100, label: "ready" },
];

function bootLabel(progress) {
  let label = BOOT_STAGES[0].label;
  for (const stage of BOOT_STAGES) {
    if (progress >= stage.at) label = stage.label;
  }
  return label;
}

// Gates first paint behind a percentage counter tied to the *real* backend
// fetch in Home.jsx — it climbs toward ~92% on a decaying interval while the
// request is in flight (we don't have byte-level progress, so this reads as
// "still working" without ever dishonestly claiming completion), then snaps
// to 100 and fades away the moment data actually arrives. On an already-fast
// load this disappears in a couple hundred ms, which is exactly right — a
// preloader that lingers on a fast page reads as fake, not premium.
export default function Preloader({ isLoading, name }) {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const rafRef = useRef();

  useEffect(() => {
    if (reduceMotion) return undefined;

    let start;
    const tick = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      // Decaying approach toward 92 — fast at first, slows as it climbs,
      // never claims done until isLoading actually flips.
      setProgress((p) => (isLoading ? Math.min(92, p + (92 - p) * 0.02) : p));
      if (isLoading) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isLoading, reduceMotion]);

  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      const t = setTimeout(() => setVisible(false), reduceMotion ? 0 : 500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [isLoading, reduceMotion]);

  if (reduceMotion) {
    return isLoading ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink">
        <p className="font-mono text-sm text-slate">Loading…</p>
      </div>
    ) : null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate">
            {name || "Portfolio"}
          </p>
          <p className="font-mono text-sm text-cyan">
            &gt; {bootLabel(progress)}
            <span className="ml-0.5 inline-block h-3.5 w-[7px] animate-pulse bg-cyan align-middle" />
          </p>
          <p className="font-display text-5xl font-semibold tabular-nums text-bone sm:text-6xl">
            {Math.round(progress)}
            <span className="text-cyan">%</span>
          </p>
          <div className="h-px w-40 overflow-hidden bg-line">
            <motion.div
              className="h-full bg-cyan"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

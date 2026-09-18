import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

// The "words light up as you scroll" effect from Apple/agency pages —
// genuinely scroll-scrubbed (tied to scroll position, not just triggered
// once), which reads completely differently from a fade-in-on-view. Each
// word's opacity is driven by how far the paragraph itself has scrolled
// through a fixed viewport window, so scrolling back up un-highlights words
// in reverse, exactly like a scrubber.
function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.25, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
      {"\u00A0"}
    </motion.span>
  );
}

export default function ScrollRevealText({ text, className }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.3"],
  });

  if (reduceMotion) {
    return <p className={className}>{text}</p>;
  }

  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}

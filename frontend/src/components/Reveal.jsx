import { motion, useReducedMotion } from "framer-motion";

// One quiet, consistent scroll-reveal used across every section below the
// hero — fades and lifts content in once as it enters the viewport. This is
// deliberately the *only* scroll effect most sections get: the hero carries
// the bold motion, everything after it should feel calm and confident
// rather than competing for attention. Falls back to an instant, static
// appearance under prefers-reduced-motion.
export default function Reveal({ children, delay = 0, className }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

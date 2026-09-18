import { motion, useReducedMotion } from "framer-motion";

// Headings sharpen into focus as they scroll into view — blur + opacity +
// a slight rise, instead of just appearing. A different (and more premium-
// reading) move than a plain fade-up, reserved for headings specifically
// so it doesn't compete with the rest of each section's own animations.
export default function AnimatedHeading({ children, className, as: Tag = "h2" }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[Tag];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

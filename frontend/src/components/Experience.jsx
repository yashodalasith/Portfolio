import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import SectionKicker from "./SectionKicker.jsx";
import AnimatedHeading from "./AnimatedHeading.jsx";

// Cycles through the site's three accent hues per entry, instead of every
// role using the same single amber dot — makes the timeline scannable at a
// glance and gives Experience its own color identity distinct from
// Projects (signature cyan) and Skills (grouped by category color).
//
// IMPORTANT: Tailwind's JIT scanner only picks up class names that appear
// as complete literal strings in source — `` `ring-${color}` `` would
// silently produce no CSS at all. These lookup maps keep every class name
// whole and literal so the build actually generates them.
const ACCENTS = ["cyan", "amber", "violet"];
const RING_CLASS = {
  cyan: "ring-cyan",
  amber: "ring-amber",
  violet: "ring-violet",
};
const DOT_CLASS = { cyan: "bg-cyan", amber: "bg-amber", violet: "bg-violet" };
const TEXT_CLASS = {
  cyan: "text-cyan",
  amber: "text-amber",
  violet: "text-violet",
};
const TAG_CLASS = {
  cyan: "border-cyan/30 text-cyan",
  amber: "border-amber/30 text-amber",
  violet: "border-violet/30 text-violet",
};

function EntryDot({ color }) {
  return (
    <span
      className={`absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-ink ring-2 ${RING_CLASS[color]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT_CLASS[color]}`} />
    </span>
  );
}

export default function Experience({ experiences }) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.4"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (!experiences?.length) return null;

  return (
    <section
      id="experience"
      className="section-shell mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:max-w-[52rem] lg:px-16 lg:py-20 xl:px-20"
    >
      <SectionKicker index="02" label="EXPERIENCE" color="#22e5c0" />
      <AnimatedHeading className="font-display text-[clamp(1.75rem,3vw+1rem,2.75rem)] font-semibold text-bone">
        Experience
      </AnimatedHeading>

      <div ref={containerRef} className="relative mt-8 pl-6 sm:mt-10 sm:pl-8">
        {/* Static faint track, plus a colored line that fills in as you
            scroll through the section — the timeline literally advances
            with you instead of just sitting there fully drawn. */}
        <div className="absolute left-0 top-0 h-full w-px bg-line" />
        {!reduceMotion && (
          <motion.div
            className="absolute left-0 top-0 w-px bg-gradient-to-b from-cyan via-violet to-amber"
            style={{ height: lineHeight }}
          />
        )}

        <ol className="space-y-12">
          {experiences.map((exp, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <motion.li
                key={exp._id || i}
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, x: i % 2 === 0 ? -16 : 16 }
                }
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative -mx-3 rounded-xl border border-transparent p-3 transition-colors hover:border-line hover:bg-ink-raised/50 sm:-mx-4 sm:p-4"
              >
                <EntryDot color={accent} />
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate sm:text-xs">
                  {exp.startDate} — {exp.endDate}
                </p>
                <h3 className="mt-1 font-display text-lg font-medium text-bone">
                  {exp.title}
                </h3>
                <p className={`text-sm ${TEXT_CLASS[accent]}`}>{exp.company}</p>
                <ul className="mt-3 space-y-2">
                  {(exp.bullets || []).map((b, j) => (
                    <li key={j} className="text-sm leading-relaxed text-slate">
                      {b}
                    </li>
                  ))}
                </ul>
                {exp.tags?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.tags.map((tag, k) => (
                      <span
                        key={tag}
                        className={`rounded-full border px-3 py-1 font-mono text-xs ${TAG_CLASS[ACCENTS[k % ACCENTS.length]]}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

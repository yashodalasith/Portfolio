import { motion, useReducedMotion } from "framer-motion";
import SectionKicker from "./SectionKicker.jsx";
import AnimatedHeading from "./AnimatedHeading.jsx";

export default function Education({ education }) {
  if (!education?.length) return null;

  const reduceMotion = useReducedMotion();

  return (
    <section
      id="education"
      className="section-shell mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:max-w-6xl lg:px-16 lg:py-20 xl:px-20 2xl:max-w-[1200px]"
    >
      <SectionKicker index="05" label="EDUCATION" color="#ffd23f" />
      <AnimatedHeading className="font-display text-[clamp(1.75rem,3vw+1rem,2.75rem)] font-semibold text-bone">
        Education
      </AnimatedHeading>

      <div className="mt-10 grid gap-6">
        {education.map((ed, i) => (
          <motion.article
            key={ed._id || i}
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
            whileInView={reduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.45,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={reduceMotion ? {} : { y: -4, scale: 1.01 }}
            className="group relative overflow-hidden rounded-2xl border border-line bg-ink-raised/80 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-300 sm:p-5 lg:p-6"
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/80 to-transparent opacity-80"
            />

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-slate sm:text-[10px]">
                  {ed.startDate} — {ed.endDate}
                </p>
                <h3 className="mt-2 font-display text-lg font-medium text-bone sm:text-xl md:text-2xl">
                  {ed.degree}
                </h3>
              </div>

              <span className="inline-flex w-fit items-center rounded-full border border-line bg-line-soft px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-cyan sm:px-3 sm:text-[10px]">
                {ed.institution}
              </span>
            </div>

            {ed.details?.length > 0 && (
              <ul className="mt-5 space-y-2">
                {ed.details.map((d, j) => (
                  <motion.li
                    key={j}
                    initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                    whileInView={reduceMotion ? {} : { opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.08 * j,
                      ease: "easeOut",
                    }}
                    className="flex items-start gap-3 text-sm leading-relaxed text-slate"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber shadow-[0_0_12px_rgba(255,61,71,0.8)]" />
                    <span>{d}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  );
}

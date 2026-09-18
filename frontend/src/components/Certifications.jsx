import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, FileText, Award } from "lucide-react";
import SectionKicker from "./SectionKicker.jsx";
import AnimatedHeading from "./AnimatedHeading.jsx";

export default function Certifications({ certifications }) {
  if (!certifications?.length) return null;

  const reduceMotion = useReducedMotion();

  return (
    <section
      id="certifications"
      className="section-shell mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:max-w-6xl lg:px-16 lg:py-20 xl:px-20 2xl:max-w-[1200px]"
    >
      <SectionKicker index="06" label="CERTIFICATIONS" color="#ff5470" />
      <AnimatedHeading className="font-display text-[clamp(1.75rem,3vw+1rem,2.75rem)] font-semibold text-bone">
        Certifications
      </AnimatedHeading>

      <ul className="mt-10 grid gap-5">
        {certifications.map((c, i) => (
          <motion.li
            key={c._id || i}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.45,
              delay: i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={reduceMotion ? {} : { y: -4, scale: 1.01 }}
            className="group relative overflow-hidden rounded-2xl border border-line bg-ink-raised/80 p-4 transition-all duration-300 sm:p-5 lg:p-6"
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-400/80 to-transparent opacity-90"
            />

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-line-soft text-pink-300 sm:h-11 sm:w-11">
                  <Award size={18} />
                </div>

                <div>
                  <p className="text-sm font-medium text-bone sm:text-base md:text-lg">
                    {c.title}
                  </p>
                  <p className="mt-1 text-xs text-slate sm:text-sm">
                    {c.issuer}
                  </p>
                </div>
              </div>

              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate sm:text-[10px]">
                {c.date}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {c.url && (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link inline-flex items-center gap-1.5 rounded-full border border-line bg-line-soft px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-cyan transition-colors hover:border-cyan hover:text-bone sm:text-[11px]"
                >
                  <ExternalLink size={14} />
                  Certificate URL
                </a>
              )}

              {c.fileUrl && (
                <a
                  href={c.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link inline-flex items-center gap-1.5 rounded-full border border-line bg-line-soft px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-cyan transition-colors hover:border-cyan hover:text-bone sm:text-[11px]"
                >
                  <FileText size={14} />
                  View file
                </a>
              )}
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

import { motion, useReducedMotion } from "framer-motion";
import SectionKicker from "./SectionKicker.jsx";
import ScrollRevealText from "./ScrollRevealText.jsx";
import AnimatedHeading from "./AnimatedHeading.jsx";

export default function About({ profile }) {
  const reduceMotion = useReducedMotion();
  if (!profile?.bio) return null;

  // Small honest facts derived from real profile data only — no invented
  // metrics. Anything not present is simply skipped rather than faked.
  const facts = [
    profile.location && { label: "Based in", value: profile.location },
    profile.title && { label: "Focus", value: profile.title },
    profile.yearsExperience && {
      label: "Experience",
      value: `${profile.yearsExperience}+ yrs`,
    },
  ].filter(Boolean);

  return (
    <section
      id="about"
      className="section-shell mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:max-w-6xl lg:px-16 lg:py-24 xl:px-20 2xl:max-w-[1200px]"
    >
      <SectionKicker index="01" label="ABOUT" color="#ffb238" />
      <AnimatedHeading className="font-display text-[clamp(1.75rem,3vw+1rem,2.75rem)] font-semibold text-bone">
        About
      </AnimatedHeading>

      <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,280px)_1fr] md:items-start md:gap-14">
        {profile.avatarUrl && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[280px] rounded-2xl p-[1.5px] md:mx-0"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-2xl"
              style={{
                background:
                  "linear-gradient(160deg, var(--color-cyan), var(--color-violet) 60%, transparent)",
              }}
            />
            <img
              src={profile.avatarUrl}
              alt={`${profile.name}'s profile`}
              className="relative aspect-square w-full rounded-2xl border border-ink object-cover shadow-[0_0_60px_-15px_rgba(111,227,255,0.4)]"
            />
          </motion.div>
        )}

        <div>
          <ScrollRevealText
            text={profile.bio}
            className="max-w-2xl text-base leading-relaxed text-slate sm:text-lg"
          />

          {facts.length > 0 && (
            <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-line-soft pt-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
                    {f.label}
                  </dt>
                  <dd className="mt-1.5 font-display text-lg text-bone">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}

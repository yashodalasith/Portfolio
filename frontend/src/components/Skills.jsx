import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Code2, Layers, Database, Wrench, Plus } from "lucide-react";
import SectionKicker from "./SectionKicker.jsx";
import AnimatedHeading from "./AnimatedHeading.jsx";

const GROUP_LABELS = {
  programming: "Languages",
  frameworks: "Frameworks & Libraries",
  databases: "Databases",
  tools: "Tools",
};
const GROUP_ICON = {
  programming: Code2,
  frameworks: Layers,
  databases: Database,
  tools: Wrench,
};

// An expandable "chapter list" — one row per category, numbered, glowing
// on the currently-open row — instead of four static cards all shown at
// once. Multiple rows can be open; the first is open by default.
export default function Skills({ skills }) {
  const reduceMotion = useReducedMotion();
  const groups = skills
    ? Object.keys(GROUP_LABELS).filter((g) => skills[g]?.length)
    : [];
  const [open, setOpen] = useState(() => new Set(groups.slice(0, 1)));

  if (!groups.length) return null;

  const toggle = (g) => {
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(g) ? next.delete(g) : next.add(g);
      return next;
    });
  };

  return (
    <section
      id="skills"
      className="section-shell mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:max-w-[62rem] lg:px-16 lg:py-20 xl:px-20"
    >
      <SectionKicker index="04" label="SKILLS" color="#7c5cff" />
      <AnimatedHeading className="font-display text-[clamp(1.75rem,3vw+1rem,2.75rem)] font-semibold text-bone">
        The Stack
      </AnimatedHeading>

      <div className="mt-8 divide-y divide-line-soft border-y border-line-soft">
        {groups.map((group, i) => {
          const Icon = GROUP_ICON[group];
          const isOpen = open.has(group);
          return (
            <div key={group} className="relative">
              {isOpen && (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-[2px]"
                  style={{
                    background:
                      "linear-gradient(180deg, var(--color-amber), transparent)",
                  }}
                />
              )}
              <button
                type="button"
                onClick={() => toggle(group)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 py-4 pl-3 text-left transition-colors hover:bg-line-soft sm:gap-4 sm:py-5 sm:pl-5"
              >
                <span className="font-mono text-xs text-slate">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon
                  size={16}
                  className={isOpen ? "text-amber" : "text-slate"}
                />
                <span
                  className={`flex-1 font-display text-base font-semibold sm:text-lg lg:text-xl ${isOpen ? "text-bone" : "text-slate"}`}
                >
                  {GROUP_LABELS[group]}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.25 }}
                  className={isOpen ? "text-amber" : "text-slate"}
                >
                  <Plus size={18} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduceMotion ? {} : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2 py-4 pl-3 pr-2 sm:py-5 sm:pl-5 sm:pr-3 lg:pl-16">
                      {skills[group].map((item, j) => (
                        <motion.span
                          key={item}
                          initial={
                            reduceMotion ? false : { opacity: 0, scale: 0.9 }
                          }
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.25, delay: j * 0.02 }}
                          whileHover={reduceMotion ? {} : { y: -2 }}
                          className="rounded-md border border-line bg-ink-raised/60 px-3 py-1.5 text-sm text-bone transition-colors hover:border-amber/50 hover:text-amber"
                        >
                          {item}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

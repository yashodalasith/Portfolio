import SectionKicker from "./SectionKicker.jsx";
const GROUP_LABELS = {
  programming: "Languages",
  frameworks: "Frameworks & Libraries",
  databases: "Databases",
  tools: "Tools",
};

export default function Skills({ skills }) {
  if (!skills) return null;
  const groups = Object.keys(GROUP_LABELS).filter((g) => skills[g]?.length);
  if (!groups.length) return null;

  return (
    <section id="skills" className="mx-auto max-w-3xl px-6 py-16 lg:px-16">
      <SectionKicker index="04" label="SKILLS" />
      <h2 className="font-display text-[clamp(1.75rem,3vw+1rem,2.75rem)] font-semibold text-bone">
        Stack
      </h2>

      {/* stacked "layers" of a tech stack, top = languages down to tools */}
      <div className="mt-10 space-y-4">
        {groups.map((group, i) => (
          <div
            key={group}
            style={{ "--layer-offset": `${i * 12}px` }}
            className="rounded-lg border border-line bg-ink-raised p-5 sm:ml-[var(--layer-offset)]"
          >
            <p className="font-mono text-xs uppercase tracking-wide text-slate">
              {GROUP_LABELS[group]}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills[group].map((item) => (
                <span
                  key={item}
                  className="rounded-md bg-line-soft px-3 py-1.5 text-sm text-bone"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

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
      <h2 className="font-display text-2xl font-semibold text-bone sm:text-3xl">
        Stack
      </h2>

      {/* stacked "layers" of a tech stack, top = languages down to tools */}
      <div className="mt-10 space-y-4">
        {groups.map((group, i) => (
          <div
            key={group}
            style={{ "--layer-offset": `${i * 12}px` }}
            className="rounded-lg border border-white/10 bg-ink-raised p-5 sm:ml-[var(--layer-offset)]"
          >
            <p className="font-mono text-xs uppercase tracking-wide text-slate">
              {GROUP_LABELS[group]}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills[group].map((item) => (
                <span
                  key={item}
                  className="rounded-md bg-white/5 px-3 py-1.5 text-sm text-bone"
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

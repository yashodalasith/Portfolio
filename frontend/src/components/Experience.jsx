export default function Experience({ experiences }) {
  if (!experiences?.length) return null;
  return (
    <section id="experience" className="mx-auto max-w-3xl px-6 py-16 lg:px-16">
      <h2 className="font-display text-2xl font-semibold text-bone sm:text-3xl">Experience</h2>

      <ol className="relative mt-10 border-l border-white/10 pl-8">
        {experiences.map((exp, i) => (
          <li key={exp._id || i} className="mb-12 last:mb-0">
            <span className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-ink ring-2 ring-amber">
              <span className="h-1.5 w-1.5 rounded-full bg-amber" />
            </span>
            <p className="font-mono text-xs text-slate">
              {exp.startDate} — {exp.endDate}
            </p>
            <h3 className="mt-1 font-display text-lg font-medium text-bone">{exp.title}</h3>
            <p className="text-sm text-cyan">{exp.company}</p>
            <ul className="mt-3 space-y-2">
              {(exp.bullets || []).map((b, j) => (
                <li key={j} className="text-sm leading-relaxed text-slate">
                  {b}
                </li>
              ))}
            </ul>
            {exp.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-slate">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

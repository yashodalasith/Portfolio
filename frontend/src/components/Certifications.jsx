export default function Certifications({ certifications }) {
  if (!certifications?.length) return null;
  return (
    <section id="certifications" className="mx-auto max-w-3xl px-6 py-16 lg:px-16">
      <h2 className="font-display text-2xl font-semibold text-bone sm:text-3xl">Certifications</h2>
      <ul className="mt-8 space-y-4">
        {certifications.map((c, i) => (
          <li key={c._id || i} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <a
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-bone hover:text-cyan"
              >
                {c.title}
              </a>
              <p className="text-sm text-slate">{c.issuer}</p>
            </div>
            <span className="font-mono text-xs text-slate">{c.date}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

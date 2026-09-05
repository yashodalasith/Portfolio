import SectionKicker from "./SectionKicker.jsx";
export default function Education({ education }) {
  if (!education?.length) return null;
  return (
    <section id="education" className="mx-auto max-w-3xl px-6 py-16 lg:px-16">
      <SectionKicker index="05" label="EDUCATION" />
      <h2 className="font-display text-[clamp(1.75rem,3vw+1rem,2.75rem)] font-semibold text-bone">Education</h2>
      <div className="mt-8 space-y-8">
        {education.map((ed, i) => (
          <div key={ed._id || i}>
            <p className="font-mono text-xs text-slate">
              {ed.startDate} — {ed.endDate}
            </p>
            <h3 className="mt-1 font-display text-lg font-medium text-bone">{ed.degree}</h3>
            <p className="text-sm text-cyan">{ed.institution}</p>
            <ul className="mt-2 space-y-1">
              {(ed.details || []).map((d, j) => (
                <li key={j} className="text-sm text-slate">
                  {d}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

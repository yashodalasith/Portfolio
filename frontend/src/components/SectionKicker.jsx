// A small numbered/tagged label above each section heading — the same
// device the hero uses for its role pill, repeated as a consistent rhythm
// down the page instead of every section inventing its own header style.
export default function SectionKicker({ index, label }) {
  return (
    <div className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-cyan">
      {index && <span className="text-slate">{index}</span>}
      <span className="h-px w-8 bg-cyan/40" />
      {label}
    </div>
  );
}

// A small numbered "episode" label above each section heading — the
// editorial-series device (bold badge + big two-tone heading) repeated as a
// consistent rhythm down the page. Each section keeps its own accent color
// and a soft blurred glow behind it — the same "recurring nebula" motif
// repeated at every section transition, tying the whole page together.
export default function SectionKicker({ index, label, color = "#ff3d47" }) {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 -top-16 h-40 w-40 rounded-full opacity-25 blur-3xl"
        style={{ backgroundColor: color }}
      />
      <div className="relative mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1" style={{ borderColor: `${color}55`, backgroundColor: `${color}14` }}>
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color }}>
          {index && `Episode ${index} — `}
          {label}
        </span>
      </div>
    </div>
  );
}

import { ExternalLink, FileText } from "lucide-react";
import SectionKicker from "./SectionKicker.jsx";

export default function Certifications({ certifications }) {
  if (!certifications?.length) return null;
  return (
    <section
      id="certifications"
      className="mx-auto max-w-3xl px-6 py-16 lg:px-16"
    >
      <SectionKicker index="06" label="CERTIFICATIONS" />
      <h2 className="font-display text-[clamp(1.75rem,3vw+1rem,2.75rem)] font-semibold text-bone">
        Certifications
      </h2>
      <ul className="mt-8 space-y-4">
        {certifications.map((c, i) => (
          <li
            key={c._id || i}
            className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between"
          >
            <div>
              <p className="text-sm font-medium text-bone">{c.title}</p>
              <p className="text-sm text-slate">{c.issuer}</p>
              <div className="mt-2 flex flex-wrap gap-3">
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-cyan hover:text-bone"
                  >
                    <ExternalLink size={14} /> Certificate URL
                  </a>
                )}
                {c.fileUrl && (
                  <a
                    href={c.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-cyan hover:text-bone"
                  >
                    <FileText size={14} /> View file
                  </a>
                )}
              </div>
            </div>
            <span className="font-mono text-xs text-slate">{c.date}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

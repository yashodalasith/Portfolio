import { useState } from "react";
import { ChevronLeft, ChevronRight, Github, ExternalLink } from "lucide-react";

function ProjectCard({ project }) {
  const images = project.imageUrls?.length
    ? project.imageUrls
    : project.imageUrl
      ? [project.imageUrl]
      : [];
  const [activeImage, setActiveImage] = useState(0);
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-white/10 bg-ink-raised transition-colors hover:border-cyan/40">
      {/* terminal-window chrome, since this is a code-first portfolio */}
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-3 truncate font-mono text-xs text-slate">
          {project.category}
        </span>
      </div>

      {images.length > 0 && (
        <div className="relative">
          <img
            src={images[activeImage]}
            alt={`${project.title} preview`}
            loading="lazy"
            className="aspect-video w-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous project image"
                onClick={() =>
                  setActiveImage(
                    (activeImage - 1 + images.length) % images.length,
                  )
                }
                className="absolute left-2 top-1/2 rounded-full bg-ink/80 p-1 text-bone"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Next project image"
                onClick={() =>
                  setActiveImage((activeImage + 1) % images.length)
                }
                className="absolute right-2 top-1/2 rounded-full bg-ink/80 p-1 text-bone"
              >
                <ChevronRight size={16} />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-ink/80 px-2 py-1 font-mono text-[10px] text-bone">
                {activeImage + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-medium text-bone">
            {project.title}
          </h3>
          {project.date && (
            <span className="shrink-0 font-mono text-xs text-slate">
              {project.date}
            </span>
          )}
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate">
          {project.description}
        </p>

        {project.bullets?.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {project.bullets.slice(0, 3).map((b, i) => (
              <li key={i} className="text-xs leading-relaxed text-slate/90">
                • {b}
              </li>
            ))}
          </ul>
        )}

        {project.technologies?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-cyan"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center gap-4 pt-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-slate hover:text-bone"
            >
              <Github size={16} /> Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-slate hover:text-bone"
            >
              <ExternalLink size={16} /> Live
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Projects({ projects }) {
  if (!projects?.length) return null;
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-16 lg:px-16">
      <h2 className="font-display text-2xl font-semibold text-bone sm:text-3xl">
        Projects
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p._id || p.title} project={p} />
        ))}
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Github, ExternalLink } from "lucide-react";
import {
  SpotlightOverlay,
  useTiltSpotlight,
} from "../hooks/useTiltSpotlight.jsx";
import SectionKicker from "./SectionKicker.jsx";
import AnimatedHeading from "./AnimatedHeading.jsx";

// Solid background (no opacity) — the previous 70%-transparent card was
// exactly why adjacent cards bled into each other during scroll. Cards must
// be fully opaque to read cleanly in any carousel/scroll layout.
function ProjectCard({ project, isActive, registerRef }) {
  const images = project.imageUrls?.length
    ? project.imageUrls
    : project.imageUrl
      ? [project.imageUrl]
      : [];
  const [activeImage, setActiveImage] = useState(0);
  const { ref: tiltRef, handlers } = useTiltSpotlight({ tiltDegrees: 4 });
  const reduceMotion = useReducedMotion();

  return (
    <article
      ref={(el) => {
        tiltRef.current = el;
        registerRef(el);
      }}
      {...handlers}
      className="group relative flex w-[85vw] max-w-[440px] shrink-0 snap-center flex-col overflow-hidden rounded-xl border bg-ink-raised shadow-[0_0_0_1px_rgba(255,61,71,0.06)] transition-[border-color,transform,box-shadow,opacity] duration-500 ease-out hover:border-amber/50 hover:shadow-[0_0_40px_-12px_rgba(255,61,71,0.35)] [transform-style:preserve-3d]"
      style={{
        borderColor: isActive ? "rgb(255 61 71 / 0.4)" : "var(--color-line)",
        opacity: isActive ? 1 : 0.55,
        transform: isActive || reduceMotion ? "scale(1)" : "scale(0.94)",
      }}
    >
      <SpotlightOverlay />
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <span className="ml-3 truncate font-mono text-xs text-slate">
          {project.category}
        </span>
      </div>

      {images.length > 0 && (
        <div className="relative overflow-hidden">
          <div className="aspect-video w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={images[activeImage]}
                alt={`${project.title} preview`}
                loading="lazy"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1, scale: reduceMotion ? 1 : [1, 1.06] }}
                exit={reduceMotion ? {} : { opacity: 0 }}
                whileHover={reduceMotion ? {} : { scale: 1.12 }}
                transition={{
                  opacity: { duration: 0.4 },
                  scale: { duration: 8, ease: "linear" },
                }}
                className="h-full w-full object-cover"
              />
            </AnimatePresence>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(160deg, rgb(255 61 71 / 0.16), transparent 60%)",
              }}
            />
          </div>
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
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-bone"
                style={{ backgroundColor: "var(--color-ink)" }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Next project image"
                onClick={() =>
                  setActiveImage((activeImage + 1) % images.length)
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-bone"
                style={{ backgroundColor: "var(--color-ink)" }}
              >
                <ChevronRight size={16} />
              </button>
              <div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-1 font-mono text-[10px] text-bone"
                style={{ backgroundColor: "var(--color-ink)" }}
              >
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
                className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-cyan"
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

// A plain native-scroll, scroll-snap carousel — no pinning, no transform
// hijacking, no hidden math that can desync from real scroll position.
// Reliability was the point after the pinned version broke down: this is
// just `overflow-x-auto` + `scroll-snap`, the same mechanism every OS uses
// for its own carousels, so it can't get into a broken visual state.
function ProjectCarousel({ projects }) {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = cardRefs.current.indexOf(visible.target);
          if (idx !== -1) setActive(idx);
        }
      },
      { root: track, threshold: [0.5, 0.75, 0.95] },
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [projects.length]);

  const scrollToIndex = (i) => {
    const nextIndex = Math.max(0, Math.min(i, projects.length - 1));
    const track = trackRef.current;
    const card = cardRefs.current[nextIndex];

    if (!card || !track) return;

    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const targetLeft =
      track.scrollLeft +
      (cardRect.left - trackRect.left) -
      (track.clientWidth - cardRect.width) / 2;
    const maxScrollLeft = track.scrollWidth - track.clientWidth;

    setActive(nextIndex);
    track.scrollTo({
      left: Math.max(0, Math.min(targetLeft, maxScrollLeft)),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const activeProject = projects[active] || projects[0];

  return (
    <div className="relative">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate">
            Now viewing
          </p>
          <h3 className="mt-1 truncate font-display text-xl font-medium text-bone sm:text-2xl">
            {activeProject?.title || "Projects"}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous project"
            onClick={() => scrollToIndex(Math.max(active - 1, 0))}
            className="rounded-full border border-line bg-ink-raised/80 p-2 text-bone transition-colors hover:border-amber hover:text-amber"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next project"
            onClick={() =>
              scrollToIndex(Math.min(active + 1, projects.length - 1))
            }
            className="rounded-full border border-line bg-ink-raised/80 p-2 text-bone transition-colors hover:border-amber hover:text-amber"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 lg:-mx-16 lg:px-16"
      >
        {projects.map((p, i) => (
          <ProjectCard
            key={p._id || p.title}
            project={p}
            isActive={i === active}
            registerRef={(el) => (cardRefs.current[i] = el)}
          />
        ))}
      </div>

      <div className="mt-2 flex items-center gap-2">
        {projects.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to project ${i + 1}`}
            onClick={() => scrollToIndex(i)}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === active ? "24px" : "6px",
              backgroundColor:
                i === active
                  ? "var(--color-amber)"
                  : "var(--color-line-strong)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Projects({ projects }) {
  if (!projects?.length) return null;
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-16 lg:px-16">
      <SectionKicker index="03" label="PROJECTS" color="#ff4fd8" />
      <AnimatedHeading className="font-display text-[clamp(1.75rem,3vw+1rem,2.75rem)] font-semibold text-bone">
        Projects
      </AnimatedHeading>
      <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-slate">
        Use the arrows
      </p>
      <div className="mt-6">
        <ProjectCarousel projects={projects} />
      </div>
    </section>
  );
}

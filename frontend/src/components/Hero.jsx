import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Github, Linkedin, FileDown } from "lucide-react";

// Splits the headline into words and reveals them with a stagger — the free,
// framer-motion equivalent of GSAP's paid SplitText plugin.
// The signature hero move: solid type on the left dissolving into hollow
// outline type on the right — an outline copy sits behind an identical
// gradient-clipped fill copy, both rendering the same text so they align
// pixel-for-pixel. Falls back to plain solid text under reduced motion,
// since the effect itself is static (no animation loop), but the illusion
// depends on precise color contrast some users may find busy.
function DissolveHeadline({ text, reduceMotion, className }) {
  const entrance = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
      };

  const [activeLetters, setActiveLetters] = useState({});
  const containerRef = useRef(null);
  const charRefs = useRef([]);

  const lines = Array.isArray(text) ? text : [text];
  const lineOffsets = [];
  let runningOffset = 0;

  lines.forEach((line) => {
    lineOffsets.push(runningOffset);
    runningOffset += line.length;
  });

  const updateActiveLetters = (clientX) => {
    if (!containerRef.current) return;

    const nextActive = {};

    charRefs.current.forEach((node, index) => {
      if (!node) return;

      const nodeRect = node.getBoundingClientRect();
      const centerX = nodeRect.left + nodeRect.width / 2;
      const distance = Math.abs(clientX - centerX);

      const intensity = Math.max(0, 1 - distance / 135);
      if (intensity > 0.04) {
        nextActive[index] = intensity;
      }
    });

    setActiveLetters(nextActive);
  };

  if (reduceMotion) {
    return (
      <h1 className={className}>
        {lines.map((line, lineIndex) => (
          <span key={lineIndex} className="block">
            {line}
          </span>
        ))}
      </h1>
    );
  }

  return (
    <motion.h1
      {...entrance}
      ref={containerRef}
      onPointerMove={(event) => updateActiveLetters(event.clientX)}
      onPointerLeave={() => setActiveLetters({})}
      className="relative inline-block"
    >
      <span
        aria-hidden="true"
        className={`${className} pointer-events-none absolute inset-0`}
      >
        {lines.map((line, lineIndex) => (
          <span key={`outline-line-${lineIndex}`} className="block">
            {Array.from(line).map((char, charIndex) => {
              const globalIndex = lineOffsets[lineIndex] + charIndex;
              const glow = activeLetters[globalIndex] || 0;

              return (
                <span
                  key={`outline-${globalIndex}`}
                  ref={(el) => {
                    charRefs.current[globalIndex] = el;
                  }}
                  className="inline-block transition-all duration-200 ease-out"
                  style={{
                    WebkitTextStroke: "1.5px var(--color-bone)",
                    color: "transparent",
                    transform: `scale(${1 + glow * 0.42})`,
                    filter: `drop-shadow(0 0 ${22 + glow * 34}px rgba(255,255,255,${0.25 + glow * 0.75})) drop-shadow(0 0 ${18 + glow * 24}px rgba(255,96,96,${0.32 + glow * 0.68}))`,
                    opacity: 0.58 + glow * 0.42,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              );
            })}
          </span>
        ))}
      </span>

      <span
        aria-hidden="true"
        className={`${className} pointer-events-none inline-block`}
      >
        {lines.map((line, lineIndex) => (
          <span key={`fill-line-${lineIndex}`} className="block">
            {Array.from(line).map((char, charIndex) => {
              const globalIndex = lineOffsets[lineIndex] + charIndex;
              const glow = activeLetters[globalIndex] || 0;

              return (
                <span
                  key={`fill-${globalIndex}`}
                  className="relative inline-block transition-all duration-200 ease-out"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, var(--color-bone) 42%, transparent 78%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    transform: `scale(${1 + glow * 0.42})`,
                    filter: `drop-shadow(0 0 ${26 + glow * 34}px rgba(255,61,71,${0.24 + glow * 0.76})) drop-shadow(0 0 ${20 + glow * 22}px rgba(255,159,66,${0.28 + glow * 0.72}))`,
                    textShadow: `0 0 ${24 + glow * 42}px rgba(255,61,71,${0.12 + glow * 0.88})`,
                    opacity: 0.54 + glow * 0.46,
                  }}
                >
                  {glow > 0.06 && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 20%, rgba(255,255,255,0.9) 42%, rgba(255,191,120,0.8) 58%, rgba(255,255,255,0.2) 78%, transparent 100%)",
                        transform: `translateX(${glow * 10}px) scaleX(${1 + glow * 0.7})`,
                        filter: `blur(${8 + glow * 9}px)`,
                        opacity: 0.22 + glow * 0.78,
                        mixBlendMode: "screen",
                      }}
                    />
                  )}
                  {char === " " ? "\u00A0" : char}
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </motion.h1>
  );
}

function MagneticLink({ href, className, children }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const handleMove = (e) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    ref.current.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
  };
  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0px, 0px)";
  };
  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </a>
  );
}

function BeamButton({ href, children, reduceMotion }) {
  return (
    <a href={href} className="group relative rounded-full p-[1.5px]">
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "conic-gradient(var(--color-amber) 0deg, transparent 60deg, transparent 300deg, var(--color-amber) 360deg)",
          animation: reduceMotion ? "none" : "beam-spin 2.5s linear infinite",
        }}
      />
      <span className="relative block rounded-full border border-line-strong bg-ink px-7 py-3 text-sm font-medium tracking-wide text-bone transition-colors group-hover:border-transparent group-hover:text-amber">
        {children}
      </span>
    </a>
  );
}

function MarqueeStrip({ items, reduceMotion }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative mt-14 w-full overflow-hidden border-y border-line-soft py-3">
      <div
        className="flex w-max gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-[0.25em] text-slate"
        style={{
          animation: reduceMotion ? "none" : "marquee 28s linear infinite",
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            {item}
            <span className="text-amber/60">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero({ profile }) {
  const reduceMotion = useReducedMotion();
  if (!profile) return null;
  const { name, title, tagline, socials, resumeUrl } = profile;
  const tickerItems = [
    title,
    "AI-augmented development",
    "Full-stack engineering",
    "Sri Lanka",
  ].filter(Boolean);

  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pb-16 pt-32 lg:px-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-line-strong) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 30% 30%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 30% 30%, black 0%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        {/* Left: editorial title block */}
        <div>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-line-soft px-3 py-1"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber" />
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate">
              Portfolio · Latest Edition
            </span>
          </motion.div>

          <div className="mt-5">
            <DissolveHeadline
              text={name.toUpperCase().split(/\s+/).filter(Boolean)}
              reduceMotion={reduceMotion}
              className="font-display text-[clamp(2.75rem,7vw+1rem,6rem)] font-bold leading-[0.95] tracking-tight text-bone"
            />
          </div>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-1 font-display text-[clamp(1.5rem,3vw+0.5rem,2.75rem)] font-bold uppercase tracking-tight"
            style={{ color: "var(--color-amber)" }}
          >
            {title}
          </motion.p>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-slate sm:text-lg"
          >
            {tagline}
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <MagneticLink
              href="#projects"
              className="rounded-full bg-amber px-7 py-3 text-sm font-semibold tracking-wide text-ink hover:scale-105"
            >
              View Projects
            </MagneticLink>
            <BeamButton href="#ask" reduceMotion={reduceMotion}>
              Ask the AI about me
            </BeamButton>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex items-center gap-6 text-slate"
          >
            {socials?.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="transition-colors hover:text-amber"
              >
                <Github size={20} />
              </a>
            )}
            {socials?.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="transition-colors hover:text-amber"
              >
                <Linkedin size={20} />
              </a>
            )}
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Download résumé"
                className="transition-colors hover:text-amber"
              >
                <FileDown size={20} />
              </a>
            )}
          </motion.div>
        </div>

        {/* Right: the photo, in a bordered "featured" card */}
        {profile.avatarUrl && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="absolute -inset-3 rounded-[2rem] border border-line" />
            <div className="relative overflow-hidden rounded-3xl border border-line-strong bg-ink-raised shadow-2xl">
              <span className="absolute left-4 top-4 z-10 rounded-full bg-amber px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink">
                Featured Dev
              </span>
              <img
                src={profile.avatarUrl}
                alt={`${name}'s profile`}
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/40 to-transparent p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate">
                  {title}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {tickerItems.length > 0 && (
        <MarqueeStrip items={tickerItems} reduceMotion={reduceMotion} />
      )}

      {!reduceMotion && (
        <motion.div
          className="mt-4 hidden justify-center gap-2 text-slate md:flex"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span
            className="font-mono text-[11px] uppercase tracking-[0.3em]"
            style={{ color: "var(--color-amber)" }}
          >
            ↓ Scroll to begin
          </span>
        </motion.div>
      )}

      <style>{`
        @keyframes marquee {
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

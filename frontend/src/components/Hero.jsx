import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Github, Linkedin, FileDown } from "lucide-react";

// Splits the headline into words and reveals them with a stagger — the free,
// framer-motion equivalent of GSAP's paid SplitText plugin. Falls back to a
// plain instant heading under prefers-reduced-motion.
function AnimatedHeadline({ text, reduceMotion }) {
  if (reduceMotion) {
    return (
      <h1 className="font-display text-[clamp(3rem,10vw+1rem,8.5rem)] font-semibold leading-[0.9] tracking-tight text-bone">
        {text}
      </h1>
    );
  }

  const words = text.split(" ");
  return (
    <h1 className="font-display text-[clamp(3rem,10vw+1rem,8.5rem)] font-semibold leading-[0.9] tracking-tight text-bone">
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4 + i * 0.09, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

// A little "magnetic" pull toward the cursor within the button's bounds.
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

// A rotating conic-gradient ring on hover — the "border beam" pattern, in
// the site's one signature accent color, reused consistently on every
// secondary action (see also AIChatWidget.jsx).
function BeamButton({ href, children, reduceMotion }) {
  return (
    <a href={href} className="group relative rounded-full p-[1.5px]">
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: "conic-gradient(var(--color-cyan) 0deg, transparent 60deg, transparent 300deg, var(--color-cyan) 360deg)",
          animation: reduceMotion ? "none" : "beam-spin 2.5s linear infinite",
        }}
      />
      <span className="relative block rounded-full border border-line-strong bg-ink px-7 py-3 text-sm font-medium tracking-wide text-bone transition-colors group-hover:border-transparent group-hover:text-cyan">
        {children}
      </span>
    </a>
  );
}

// A slow horizontal ticker of repeating role/stack keywords — pure texture,
// the kind of small commitment-to-the-bit detail that reads as intentional
// craft rather than a template default.
function MarqueeStrip({ items, reduceMotion }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative mt-16 w-full overflow-hidden border-y border-line-soft py-3">
      <div
        className="flex w-max gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-[0.25em] text-slate"
        style={{ animation: reduceMotion ? "none" : "marquee 28s linear infinite" }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            {item}
            <span className="text-cyan/50">/</span>
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
  const tickerItems = [title, "AI-augmented development", "Full-stack engineering", "Sri Lanka"].filter(Boolean);

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-32 text-center lg:px-16"
    >
      {/* Ambient texture only — faded via mask so it never competes with the
          3D piece or the text for attention. Pure CSS, no canvas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(var(--color-line-strong) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 65% 55% at 50% 40%, black 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 55% at 50% 40%, black 0%, transparent 75%)",
        }}
      />

      {profile.avatarUrl && (
        <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="relative mb-8 rounded-2xl p-[1.5px]">
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl"
            style={{ background: "linear-gradient(135deg, var(--color-cyan), transparent 60%)" }}
          />
          <img
            src={profile.avatarUrl}
            alt={`${name}'s profile`}
            className="relative h-16 w-16 rounded-2xl border border-ink object-cover sm:h-20 sm:w-20"
          />
        </motion.div>
      )}

      <motion.p
        {...fadeUp}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="rounded-full border border-line px-4 py-1.5 font-mono text-xs uppercase tracking-[0.3em] text-cyan"
      >
        {title}
      </motion.p>

      <div className="mt-6">
        <AnimatedHeadline text={name} reduceMotion={reduceMotion} />
      </div>

      <motion.p
        {...fadeUp}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate sm:text-lg"
      >
        {tagline}
      </motion.p>

      <motion.div
        {...fadeUp}
        transition={{ duration: 0.6, delay: 0.28 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <MagneticLink
          href="#projects"
          className="rounded-full bg-amber px-7 py-3 text-sm font-semibold tracking-wide text-ink hover:scale-105"
        >
          See my work
        </MagneticLink>
        <BeamButton href="#ask" reduceMotion={reduceMotion}>
          Ask the AI about me
        </BeamButton>
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ duration: 0.6, delay: 0.34 }}
        className="mt-10 flex items-center justify-center gap-6 text-slate"
      >
        {socials?.github && (
          <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="transition-colors hover:text-cyan">
            <Github size={20} />
          </a>
        )}
        {socials?.linkedin && (
          <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-cyan">
            <Linkedin size={20} />
          </a>
        )}
        {resumeUrl && (
          <a href={resumeUrl} target="_blank" rel="noreferrer" aria-label="Download résumé" className="transition-colors hover:text-cyan">
            <FileDown size={20} />
          </a>
        )}
      </motion.div>

      {tickerItems.length > 0 && <MarqueeStrip items={tickerItems} reduceMotion={reduceMotion} />}

      {!reduceMotion && (
        <motion.div
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-slate md:flex"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="h-8 w-px bg-gradient-to-b from-slate to-transparent" />
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

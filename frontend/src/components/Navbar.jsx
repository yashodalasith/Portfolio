import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, Github, Linkedin } from "lucide-react";

const LINKS = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
  { href: "#ask", label: "Ask the AI" },
];

// A cinematic full-screen menu (not a dropdown) — big numbered links,
// staggered in, socials pinned at the bottom. Same device on every screen
// size rather than a different pattern for mobile vs desktop, which keeps
// the nav bar itself minimal at all times: just a wordmark and one trigger.
export default function Navbar({ name, socials }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] border-b border-line-soft bg-ink/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <a
          href="#top"
          className="min-w-0 truncate font-display text-lg font-semibold tracking-tight text-bone"
        >
          {name || "Portfolio"}
        </a>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className={`relative z-50 flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-200 ${
            open
              ? "border-amber bg-amber/10 text-amber shadow-[0_0_0_1px_rgba(255,61,71,0.25)]"
              : "border-line bg-ink-raised/80 text-bone hover:border-amber hover:text-amber"
          }`}
        >
          {open ? <X size={16} /> : <Menu size={16} />}
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduceMotion ? false : { clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={reduceMotion ? {} : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-20 h-screen w-screen overflow-hidden bg-ink/95 px-6 py-10 backdrop-blur-xl sm:px-12"
            style={{
              backgroundImage:
                "radial-gradient(circle at top, rgba(255, 61, 71, 0.12), transparent 38%)",
            }}
          >
            <div className="mx-auto h-full max-w-6xl overflow-y-auto overscroll-contain pb-8">
              <div className="flex min-h-full flex-col pt-20">
                <ul className="flex flex-col gap-1">
                  {LINKS.map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: reduceMotion ? 0 : 0.15 + 0.05 * i,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="border-b border-line-soft"
                    >
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-baseline gap-4 py-4 sm:py-5"
                      >
                        <span className="font-mono text-xs text-slate">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-display text-3xl font-bold uppercase tracking-tight text-bone transition-colors group-hover:text-amber sm:text-5xl">
                          {link.label}
                        </span>
                      </a>
                    </motion.li>
                  ))}
                </ul>

                {(socials?.github || socials?.linkedin) && (
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex items-center gap-6 border-t border-line-soft pt-6"
                  >
                    <span className="font-mono text-xs uppercase tracking-[0.3em] text-slate">
                      Socials
                    </span>
                    {socials?.github && (
                      <a
                        href={socials.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate transition-colors hover:text-amber"
                        aria-label="GitHub"
                      >
                        <Github size={20} />
                      </a>
                    )}
                    {socials?.linkedin && (
                      <a
                        href={socials.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate transition-colors hover:text-amber"
                        aria-label="LinkedIn"
                      >
                        <Linkedin size={20} />
                      </a>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

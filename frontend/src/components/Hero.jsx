import { motion } from "framer-motion";
import { Github, Linkedin, FileDown } from "lucide-react";
import Hero3D from "./Hero3D.jsx";

export default function Hero({ profile }) {
  if (!profile) return null;
  const { name, title, tagline, socials, resumeUrl } = profile;

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col-reverse items-center gap-8 overflow-hidden px-4 pb-12 pt-28 sm:px-6 md:flex-row md:gap-6 md:pt-0 lg:px-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xl min-w-0 md:w-1/2"
      >
        <p className="font-mono text-sm text-cyan">{title}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-bone sm:text-5xl lg:text-6xl">
          {name}
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-slate sm:text-lg">
          {tagline}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            className="rounded-full bg-amber px-6 py-3 text-sm font-medium text-ink transition-transform hover:scale-105"
          >
            See my work
          </a>
          <a
            href="#ask"
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-cyan hover:text-cyan"
          >
            Ask the AI about me
          </a>
        </div>

        <div className="mt-8 flex items-center gap-5 text-slate">
          {socials?.github && (
            <a
              href={socials.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="hover:text-bone"
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
              className="hover:text-bone"
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
              className="hover:text-bone"
            >
              <FileDown size={20} />
            </a>
          )}
        </div>
      </motion.div>

      <div className="relative h-[280px] w-full min-w-0 sm:h-[340px] md:h-[520px] md:w-1/2">
        {profile.avatarUrl && (
          <img
            src={profile.avatarUrl}
            alt={`${name}'s profile`}
            className="absolute left-1/2 top-1/2 z-10 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-ink object-cover shadow-2xl sm:h-36 sm:w-36"
          />
        )}
        <Hero3D />
      </div>
    </section>
  );
}

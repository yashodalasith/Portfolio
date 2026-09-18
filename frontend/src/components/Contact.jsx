import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import SectionKicker from "./SectionKicker.jsx";
import AnimatedHeading from "./AnimatedHeading.jsx";
import client from "../api/client.js";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function Contact({ profile }) {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (status.type !== "idle") {
      setStatus({ type: "idle", message: "" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email || !form.subject || !form.message) {
      setStatus({
        type: "error",
        message: "Please fill in your email, subject, and message.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      await client.post("/contact", {
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });

      setForm(initialForm);
      setStatus({
        type: "success",
        message: "Your message was sent successfully.",
      });
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        "Something went wrong while sending your message.";
      setStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="section-shell mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:max-w-6xl lg:px-16 lg:py-20 xl:px-20 2xl:max-w-[1200px]"
    >
      <SectionKicker index="07" label="CONTACT" color="#7c5cff" />
      <AnimatedHeading className="font-display text-[clamp(1.75rem,3vw+1rem,2.75rem)] font-semibold text-bone">
        Contact me
      </AnimatedHeading>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.35fr] lg:items-start">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[28px] border border-line bg-gradient-to-br from-line-soft via-ink-raised/80 to-transparent p-5 shadow-[0_18px_50px_-30px_rgba(124,92,255,0.55)] sm:p-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet/60 bg-violet/10 text-violet">
              <Mail size={18} />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate">
                Reach out
              </p>
              <h3 className="font-display text-xl font-semibold text-bone">
                Let’s build something great
              </h3>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
                Email
              </p>
              <a
                href={profile?.email ? `mailto:${profile.email}` : undefined}
                className="mt-2 inline-flex text-base text-bone transition-colors hover:text-cyan sm:text-lg"
              >
                {profile?.email || "Add an email in the profile backend"}
              </a>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
                Availability
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate sm:text-base">
                Open to product engineering, platform work, and meaningful
                collaboration opportunities.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[28px] border border-line bg-ink-raised/80 p-4 shadow-[0_18px_50px_-30px_rgba(255,61,71,0.35)] sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-slate">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.24em] text-slate">
                Your name
              </span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full rounded-2xl border border-line bg-transparent px-3.5 py-3 text-bone placeholder:text-slate/60 focus:border-cyan focus:outline-none"
              />
            </label>

            <label className="block text-sm text-slate">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.24em] text-slate">
                Email
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-line bg-transparent px-3.5 py-3 text-bone placeholder:text-slate/60 focus:border-cyan focus:outline-none"
                required
              />
            </label>
          </div>

          <label className="mt-4 block text-sm text-slate">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.24em] text-slate">
              Subject
            </span>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Project collaboration"
              className="w-full rounded-2xl border border-line bg-transparent px-3.5 py-3 text-bone placeholder:text-slate/60 focus:border-cyan focus:outline-none"
              required
            />
          </label>

          <label className="mt-4 block text-sm text-slate">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.24em] text-slate">
              Message
            </span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell me a little about what you’re looking for..."
              rows={6}
              className="w-full resize-none rounded-2xl border border-line bg-transparent px-3.5 py-3 text-bone placeholder:text-slate/60 focus:border-cyan focus:outline-none"
              required
            />
          </label>

          {status.message && (
            <div
              className={`mt-4 flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm ${
                status.type === "success"
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/50 bg-red-500/10 text-red-300"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{status.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-transparent bg-gradient-to-r from-amber via-orange-400 to-pink-500 px-4 py-3 font-medium text-ink shadow-[0_0_30px_rgba(255,61,71,0.35)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-ink/40 border-t-ink" />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Send message
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

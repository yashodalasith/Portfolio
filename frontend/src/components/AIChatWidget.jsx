import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles, Send, Loader2, Wand2, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import client from "../api/client.js";

const SUGGESTIONS = [
  "What's their strongest technical area?",
  "Tell me about the Nexar project.",
  "What AI tools do they use day-to-day?",
];

function TypingIndicator() {
  return (
    <div className="flex w-fit items-center gap-1.5 rounded-full border border-cyan/40 bg-cyan/5 px-4 py-2.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-cyan"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function AIChatWidget({ name }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const endRef = useRef(null);
  const reduceMotion = useReducedMotion();

  async function send(text) {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    const nextHistory = [...messages, { role: "user", content: question }];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const { data } = await client.post("/ai/chat", {
        message: question,
        history: messages,
      });
      setMessages([...nextHistory, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(
        "Couldn't reach the AI assistant right now. Try again in a moment.",
      );
    } finally {
      setLoading(false);
      setTimeout(
        () =>
          endRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          }),
        50,
      );
    }
  }

  return (
    <section
      id="ask"
      className="section-shell mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:max-w-[64rem] lg:px-16 lg:py-20 xl:px-20"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-4 flex items-center gap-3 sm:gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-violet/50 bg-violet/10 text-violet sm:h-10 sm:w-10">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-violet">
              AI assistant
            </p>
            <h2 className="font-display text-xl font-semibold text-bone sm:text-2xl lg:text-3xl">
              Ask about {name || "me"}
            </h2>
          </div>
        </div>

        <p className="max-w-2xl text-xs leading-relaxed text-slate sm:text-sm">
          Hiring for a role? Ask this assistant anything about my experience,
          projects, or skills — it only answers from what's actually on this
          page.
        </p>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 overflow-hidden rounded-[28px] border border-line bg-ink-raised/90 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
      >
        <div className="flex items-center justify-between border-b border-line bg-gradient-to-r from-line-soft via-transparent to-transparent px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber" />
            <span className="h-2.5 w-2.5 rounded-full bg-cyan" />
            <span className="h-2.5 w-2.5 rounded-full bg-violet" />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMessages([]);
                setInput("");
                setError(null);
              }}
              disabled={messages.length === 0 && !input && !error && !loading}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-transparent px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate transition-colors hover:border-amber/60 hover:text-amber disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={12} />
              Clear
            </button>

            <div className="inline-flex items-center gap-2 rounded-full border border-violet/40 bg-violet/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-violet">
              <Wand2 size={12} />
              On-page AI
            </div>
          </div>
        </div>

        <div className="flex min-h-[320px] flex-col p-3 sm:p-4 lg:p-5">
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={s}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    whileHover={
                      reduceMotion
                        ? {}
                        : { y: -2, borderColor: "rgba(34,229,192,0.7)" }
                    }
                    onClick={() => send(s)}
                    className="rounded-full border border-line bg-line-soft px-3 py-1.5 text-left text-xs text-slate transition-colors hover:text-cyan"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={
                    reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? {} : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={`max-w-[94%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed whitespace-pre-wrap sm:max-w-[88%] sm:px-4 sm:py-3 ${
                    m.role === "user"
                      ? "ml-auto border border-amber/30 bg-gradient-to-r from-amber to-amber/90 text-ink"
                      : "mr-auto border border-line bg-line-soft text-bone"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <ReactMarkdown
                      components={{
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan underline decoration-cyan/40 underline-offset-2 hover:text-bone"
                          />
                        ),
                        p: ({ node, ...props }) => (
                          <p {...props} className="mb-2 last:mb-0" />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul
                            {...props}
                            className="mb-2 list-disc space-y-1 pl-5"
                          />
                        ),
                        li: ({ node, ...props }) => (
                          <li {...props} className="leading-relaxed" />
                        ),
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  ) : (
                    m.content
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && <TypingIndicator />}
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="mt-3 flex gap-2 border-t border-line pt-3 sm:mt-4 sm:pt-4"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="flex-1 rounded-full border border-line bg-transparent px-3 py-2.5 text-sm text-bone placeholder:text-slate/60 focus:border-cyan focus:outline-none sm:px-4"
            />
            <motion.button
              type="submit"
              disabled={loading}
              aria-label="Send"
              whileHover={reduceMotion ? {} : { scale: 1.08 }}
              whileTap={reduceMotion ? {} : { scale: 0.94 }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-amber via-amber to-orange-400 text-ink shadow-[0_0_24px_rgba(255,61,71,0.35)] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}

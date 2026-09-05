import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import client from "../api/client.js";

// All chat logic below (send, state, error handling, markdown rendering) is
// unchanged from the original — this is a visual redesign only.

const SUGGESTIONS = [
  "What's their strongest technical area?",
  "Tell me about the Nexar project.",
  "What AI tools do they use day-to-day?",
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-line-soft px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-cyan"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
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
        // send prior turns (without the one we just added) as short-term context
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
        () => endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
        50,
      );
    }
  }

  return (
    <section id="ask" className="mx-auto max-w-2xl px-6 py-16 lg:px-16">
      <div className="flex items-center gap-2">
        <Sparkles size={20} className="text-violet" />
        <h2 className="font-display text-2xl font-semibold text-bone sm:text-3xl">
          Ask about {name || "me"}
        </h2>
      </div>
      <p className="mt-3 text-sm text-slate">
        Hiring for a role? Ask this assistant anything about my experience,
        projects, or skills — it only answers from what's actually on this page.
      </p>

      <div className="mt-6 flex min-h-[220px] flex-col rounded-lg border border-line bg-ink-raised p-4">
          <div className="flex-1 space-y-3 overflow-y-auto">
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={s}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    whileHover={reduceMotion ? {} : { y: -2 }}
                    onClick={() => send(s)}
                    className="rounded-full border border-line px-3 py-1.5 text-left text-xs text-slate transition-colors hover:border-cyan hover:text-cyan"
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
                  initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "ml-auto bg-amber text-ink"
                      : "bg-line-soft text-bone"
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
            className="mt-4 flex gap-2 border-t border-line pt-4"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="flex-1 rounded-full border border-line bg-transparent px-4 py-2 text-sm text-bone placeholder:text-slate/60 focus:border-cyan"
            />
            <motion.button
              type="submit"
              disabled={loading}
              aria-label="Send"
              whileHover={reduceMotion ? {} : { scale: 1.08 }}
              whileTap={reduceMotion ? {} : { scale: 0.94 }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber text-ink disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </motion.button>
          </form>
      </div>
    </section>
  );
}

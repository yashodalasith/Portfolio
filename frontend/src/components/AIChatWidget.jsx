import { useRef, useState } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import client from "../api/client.js";

const SUGGESTIONS = [
  "What's their strongest technical area?",
  "Tell me about the Nexar project.",
  "What AI tools do they use day-to-day?",
];

export default function AIChatWidget({ name }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const endRef = useRef(null);

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
        () => endRef.current?.scrollIntoView({ behavior: "smooth" }),
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

      <div className="mt-6 flex min-h-[220px] flex-col rounded-lg border border-white/10 bg-ink-raised p-4">
        <div className="flex-1 space-y-3 overflow-y-auto">
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-left text-xs text-slate hover:border-cyan hover:text-cyan"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "ml-auto bg-amber text-ink"
                  : "bg-white/5 text-bone"
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
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-slate">
              <Loader2 size={16} className="animate-spin" /> Thinking…
            </div>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="mt-4 flex gap-2 border-t border-white/10 pt-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question…"
            className="flex-1 rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-bone placeholder:text-slate/60 focus:border-cyan"
          />
          <button
            type="submit"
            disabled={loading}
            aria-label="Send"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber text-ink disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}

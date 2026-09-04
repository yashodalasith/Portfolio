import { GoogleGenAI } from "@google/genai";
import { buildAIContext } from "../utils/buildAIContext.js";

const SYSTEM_PROMPT_PREFIX = `You are the AI assistant embedded in Yashodha Jayasinghe's personal portfolio site. \
You are answering questions from recruiters and hiring managers who are evaluating Yashodha as a candidate. \
Answer ONLY using the CANDIDATE DATA below — never invent employers, dates, technologies, or achievements that \
aren't present in it. If something isn't covered by the data, say so plainly and suggest the recruiter ask \
Yashodha directly, rather than guessing. \
Keep answers structured and easy to scan: use short paragraphs and markdown bullet points where that helps. \
Be concise, factual, and confident in tone — you are advocating for a real candidate, not padding with filler. \
Never answer questions unrelated to Yashodha's candidacy, skills, or background (politely decline and redirect).

CANDIDATE DATA:
`;

export async function chat(req, res, next) {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Missing 'message' in request body",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "AI is not configured on this server (missing GEMINI_API_KEY)",
      });
    }

    const context = await buildAIContext();

    const system = SYSTEM_PROMPT_PREFIX + context;

    const messages = [
      ...(Array.isArray(history) ? history : []),
      {
        role: "user",
        content: message,
      },
    ];

    const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const contents = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: msg.content,
        },
      ],
    }));

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: system,
        maxOutputTokens: 700,
        temperature: 0.3,
      },
    });

    const text = response.text || "";

    res.json({
      reply: text,
    });
  } catch (err) {
    next(err);
  }
}

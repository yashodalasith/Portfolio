import { Router } from "express";
import rateLimit from "express-rate-limit";
import { chat } from "../controllers/aiController.js";

const router = Router();

// The AI endpoint costs real API credits per call — keep it bounded.
const chatLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 20 });

router.post("/chat", chatLimiter, chat);

export default router;

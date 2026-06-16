import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validate } from "../middlewares/validate";
import { postMessageSchema } from "../validators/chat";
import { postMessage, getHistory } from "../controllers/chatController";

const router = Router();

const messageLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: "Too many requests. Please wait a moment." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/message", messageLimiter, validate(postMessageSchema), postMessage);
router.get("/:sessionId", getHistory);

export default router;

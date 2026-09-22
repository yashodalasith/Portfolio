import { Router } from "express";
import rateLimit from "express-rate-limit";
import adminAuth from "../middleware/adminAuth.js";
import { login, updateProfile, listItems, createItem, updateItem, deleteItem } from "../controllers/adminController.js";

const router = Router();

// Slow down PIN-guessing attempts.
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post("/login", loginLimiter, login);

// Everything below requires a valid admin token AND ENABLE_ADMIN=true.
router.put("/profile", adminAuth, updateProfile);
router.get("/:resource", adminAuth, listItems);
router.post("/:resource", adminAuth, createItem); // resource: experience | project | certification | education
router.put("/:resource/:id", adminAuth, updateItem);
router.delete("/:resource/:id", adminAuth, deleteItem);

export default router;

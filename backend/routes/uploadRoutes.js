import { Router } from "express";
import multer from "multer";
import adminAuth from "../middleware/adminAuth.js";
import { handleUpload } from "../controllers/uploadController.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});
const router = Router();

router.post("/", adminAuth, upload.single("image"), handleUpload);

export default router;

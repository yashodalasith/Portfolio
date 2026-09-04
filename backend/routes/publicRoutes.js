import { Router } from "express";
import {
  getProfile,
  getExperiences,
  getProjects,
  getCertifications,
  getEducation,
  getAll,
} from "../controllers/publicController.js";

const router = Router();

router.get("/all", getAll);
router.get("/profile", getProfile);
router.get("/experience", getExperiences);
router.get("/projects", getProjects);
router.get("/certifications", getCertifications);
router.get("/education", getEducation);

export default router;

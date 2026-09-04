import jwt from "jsonwebtoken";
import Profile from "../models/Profile.js";
import Experience from "../models/Experience.js";
import Project from "../models/Project.js";
import Certification from "../models/Certification.js";
import Education from "../models/Education.js";

const MODELS = {
  experience: Experience,
  project: Project,
  certification: Certification,
  education: Education,
};

export async function login(req, res, next) {
  try {
    const { pin } = req.body;
    if (!pin || pin !== process.env.ADMIN_PIN) {
      return res.status(401).json({ error: "Incorrect PIN" });
    }
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "12h" });
    res.json({ token });
  } catch (err) {
    next(err);
  }
}

// ---- Profile (singleton: create-on-first-save, then always update) ----
export async function updateProfile(req, res, next) {
  try {
    const profile = await Profile.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

// ---- Generic CRUD for Experience / Project / Certification / Education ----
function getModel(req, res) {
  const model = MODELS[req.params.resource];
  if (!model) {
    res.status(400).json({ error: `Unknown resource "${req.params.resource}"` });
    return null;
  }
  return model;
}

export async function createItem(req, res, next) {
  try {
    const Model = getModel(req, res);
    if (!Model) return;
    const item = await Model.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function updateItem(req, res, next) {
  try {
    const Model = getModel(req, res);
    if (!Model) return;
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function deleteItem(req, res, next) {
  try {
    const Model = getModel(req, res);
    if (!Model) return;
    await Model.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

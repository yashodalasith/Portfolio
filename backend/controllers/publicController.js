import Profile from "../models/Profile.js";
import Experience from "../models/Experience.js";
import Project from "../models/Project.js";
import Certification from "../models/Certification.js";
import Education from "../models/Education.js";

const visibleProjects = { $or: [{ show: true }, { show: { $exists: false } }] };

// All of these are read-only and safe to expose publicly.

export async function getProfile(req, res, next) {
  try {
    const profile = await Profile.findOne();
    res.json(profile || {});
  } catch (err) {
    next(err);
  }
}

export async function getExperiences(req, res, next) {
  try {
    const experiences = await Experience.find().sort({ order: 1 });
    res.json(experiences);
  } catch (err) {
    next(err);
  }
}

export async function getProjects(req, res, next) {
  try {
    const projects = await Project.find(visibleProjects).sort({ order: 1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

export async function getCertifications(req, res, next) {
  try {
    const certifications = await Certification.find().sort({ order: 1 });
    res.json(certifications);
  } catch (err) {
    next(err);
  }
}

export async function getEducation(req, res, next) {
  try {
    const education = await Education.find().sort({ order: 1 });
    res.json(education);
  } catch (err) {
    next(err);
  }
}

// Convenience endpoint: everything in one call, used by the frontend and by
// the AI context builder.
export async function getAll(req, res, next) {
  try {
    const [profile, experiences, projects, certifications, education] = await Promise.all([
      Profile.findOne(),
      Experience.find().sort({ order: 1 }),
      Project.find(visibleProjects).sort({ order: 1 }),
      Certification.find().sort({ order: 1 }),
      Education.find().sort({ order: 1 }),
    ]);
    res.json({ profile, experiences, projects, certifications, education });
  } catch (err) {
    next(err);
  }
}

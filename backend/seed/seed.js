import "dotenv/config";
import { connectDB } from "../config/db.js";
import mongoose from "mongoose";
import Profile from "../models/Profile.js";
import Experience from "../models/Experience.js";
import Project from "../models/Project.js";
import Certification from "../models/Certification.js";
import Education from "../models/Education.js";
import { profile, experiences, projects, certifications, education } from "./seedData.js";

async function run() {
  await connectDB();

  console.log("[seed] clearing existing collections...");
  await Promise.all([
    Experience.deleteMany({}),
    Project.deleteMany({}),
    Certification.deleteMany({}),
    Education.deleteMany({}),
  ]);

  console.log("[seed] inserting profile...");
  await Profile.findOneAndUpdate({}, profile, { upsert: true, new: true, setDefaultsOnInsert: true });

  console.log("[seed] inserting experiences, projects, certifications, education...");
  await Experience.insertMany(experiences);
  await Project.insertMany(projects);
  await Certification.insertMany(certifications);
  await Education.insertMany(education);

  console.log("[seed] done.");
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});

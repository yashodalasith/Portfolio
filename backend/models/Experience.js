import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: String, required: true }, // stored as display string e.g. "Feb 2025"
    endDate: { type: String, default: "Present" },
    bullets: [String],
    tags: [String], // tech tags shown as chips
    order: { type: Number, default: 0 }, // lower = more recent / shown first
  },
  { timestamps: true }
);

export default mongoose.model("Experience", ExperienceSchema);

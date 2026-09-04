import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: "Group Project" }, // "Individual Project" | "Group Project" | "Research"
    date: { type: String, default: "" },
    description: { type: String, default: "" },
    bullets: [String],
    technologies: [String],
    githubUrl: String,
    liveUrl: String,
    imageUrl: String,
    imageUrls: [String],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Project", ProjectSchema);

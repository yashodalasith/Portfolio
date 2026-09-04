import mongoose from "mongoose";

// Singleton document: there is only ever one profile record.
const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true }, // e.g. "Software Engineer"
    tagline: { type: String, default: "" }, // one-line hero subtitle
    bio: { type: String, default: "" }, // longer About paragraph
    email: String,
    phone: String,
    location: String,
    avatarUrl: String, // Cloudinary URL
    resumeUrl: String, // Cloudinary/CDN URL to a PDF résumé
    socials: {
      linkedin: String,
      github: String,
    },
    skills: {
      programming: [String],
      frameworks: [String],
      databases: [String],
      tools: [String],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", ProfileSchema);

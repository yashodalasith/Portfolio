import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    startDate: String,
    endDate: String,
    details: [String],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Education", EducationSchema);

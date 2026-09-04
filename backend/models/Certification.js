import mongoose from "mongoose";

const CertificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    date: { type: String, default: "" },
    url: String,
    fileUrl: String,
    fileType: String,
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Certification", CertificationSchema);

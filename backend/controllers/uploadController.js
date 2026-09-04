import { uploadBuffer } from "../config/cloudinary.js";

// Admin-only. Multer holds the file in memory; we stream it to Cloudinary here.
export async function handleUpload(req, res, next) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded (field name must be 'image')" });
    }
    const result = await uploadBuffer(req.file.buffer);
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    next(err);
  }
}

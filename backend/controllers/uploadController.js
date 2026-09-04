import { uploadBuffer } from "../config/cloudinary.js";

// Admin-only. Multer holds the file in memory; we stream it to Cloudinary here.
export async function handleUpload(req, res, next) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded (field name must be 'image')" });
    }
    const isImage = req.file.mimetype.startsWith("image/");
    const originalName = req.file.originalname || "uploaded-file";
    const extension =
      originalName.match(/\.[^./\\]+$/)?.[0].toLowerCase() || "";
    const baseName =
      originalName
        .replace(/\.[^./\\]+$/, "")
        .replace(/[^a-zA-Z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "") || "uploaded-file";
    const result = await uploadBuffer(req.file.buffer, {
      resource_type: isImage ? "image" : "raw",
      public_id: `${baseName}-${Date.now()}${extension}`,
      filename_override: originalName,
      ...(isImage && {
        transformation: [{ width: 1600, crop: "limit", quality: "auto" }],
      }),
    });
    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      originalName,
    });
  } catch (err) {
    next(err);
  }
}

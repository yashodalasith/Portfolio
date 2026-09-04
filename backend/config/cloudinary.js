import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Uploads a buffer (from multer's in-memory storage) straight to Cloudinary
// via a stream, so we don't depend on the unmaintained
// multer-storage-cloudinary package (which pins an old Cloudinary v1 peer dep).
export function uploadBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "portfolio",
        transformation: [{ width: 1600, crop: "limit", quality: "auto" }],
        ...options,
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

export default cloudinary;

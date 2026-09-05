import { useState } from "react";
import { Trash2, UploadCloud } from "lucide-react";
import client from "../../api/client.js";

// Uploads a file to /admin/upload (Cloudinary under the hood) and reports
// the resulting URL back to the parent form.
export default function ImageUploadField({
  label,
  value,
  onChange,
  multiple = false,
  accept = "image/*",
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFile(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded = [];
      for (const file of multiple ? files : files.slice(0, 1)) {
        const formData = new FormData();
        formData.append("image", file);
        const { data } = await client.post("/admin/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploaded.push(data.url);
      }
      onChange(
        multiple
          ? [...(Array.isArray(value) ? value : []), ...uploaded]
          : uploaded[0],
      );
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-xs text-slate">{label}</label>
      <div className="mt-1 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        {multiple ? (
          <div className="flex flex-wrap gap-2">
            {(value || []).map((url) => (
              <div key={url} className="relative">
                <img
                  src={url}
                  alt=""
                  className="h-12 w-12 rounded object-cover"
                />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => onChange(value.filter((item) => item !== url))}
                  className="absolute -right-1 -top-1 rounded-full bg-ink text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : value &&
          (accept.includes("pdf") || value.toLowerCase().includes(".pdf")) ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-cyan hover:text-bone"
          >
            View uploaded file
          </a>
        ) : value ? (
          <img src={value} alt="" className="h-12 w-12 rounded object-cover" />
        ) : null}
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-line px-3 py-2 text-xs text-slate hover:border-cyan">
          <UploadCloud size={14} />
          {uploading
            ? "Uploading…"
            : multiple
              ? "Upload images"
              : "Upload file"}
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            className="hidden"
            onChange={handleFile}
          />
        </label>
        <input
          value={multiple ? "" : value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            multiple
              ? "Select project images above"
              : accept.includes("pdf")
                ? "or paste a PDF/image URL"
                : "or paste an image URL"
          }
          className="min-w-0 flex-1 rounded-md border border-line bg-transparent px-3 py-2 text-xs text-bone"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

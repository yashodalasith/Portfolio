import { useState } from "react";
import { UploadCloud } from "lucide-react";
import client from "../../api/client.js";

// Uploads a file to /admin/upload (Cloudinary under the hood) and reports
// the resulting URL back to the parent form.
export default function ImageUploadField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const { data } = await client.post("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.url);
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-xs text-slate">{label}</label>
      <div className="mt-1 flex items-center gap-3">
        {value && <img src={value} alt="" className="h-12 w-12 rounded object-cover" />}
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs text-slate hover:border-cyan">
          <UploadCloud size={14} />
          {uploading ? "Uploading…" : "Upload image"}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="or paste an image URL"
          className="flex-1 rounded-md border border-white/10 bg-transparent px-3 py-2 text-xs text-bone"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

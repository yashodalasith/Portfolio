import { useEffect, useState } from "react";
import client from "../../api/client.js";
import ImageUploadField from "./ImageUploadField.jsx";

const SKILL_GROUPS = [
  { key: "programming", label: "Languages" },
  { key: "frameworks", label: "Frameworks & Libraries" },
  { key: "databases", label: "Databases" },
  { key: "tools", label: "Tools" },
];

const TEXT_FIELDS = [
  ["name", "Name"],
  ["title", "Title"],
  ["tagline", "Tagline"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["location", "Location"],
  ["resumeUrl", "Résumé URL"],
];

export default function ProfileEditor() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    client.get("/profile").then(({ data }) => {
      setForm({
        ...data,
        socials: data.socials || {},
        skills: {
          programming: (data.skills?.programming || []).join(", "),
          frameworks: (data.skills?.frameworks || []).join(", "),
          databases: (data.skills?.databases || []).join(", "),
          tools: (data.skills?.tools || []).join(", "),
        },
      });
    });
  }, []);

  if (!form) return <p className="text-sm text-slate">Loading profile…</p>;

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const payload = {
      ...form,
      skills: Object.fromEntries(
        Object.entries(form.skills).map(([k, v]) => [k, v.split(",").map((s) => s.trim()).filter(Boolean)])
      ),
    };
    try {
      await client.put("/admin/profile", payload);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <h2 className="font-display text-lg font-medium text-bone">Profile</h2>

      <ImageUploadField label="Avatar" value={form.avatarUrl} onChange={(url) => setForm({ ...form, avatarUrl: url })} />

      {TEXT_FIELDS.map(([key, label]) => (
        <div key={key}>
          <label className="block text-xs text-slate">{label}</label>
          <input
            value={form[key] || ""}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="mt-1 w-full rounded-md border border-line bg-transparent px-3 py-2 text-sm text-bone"
          />
        </div>
      ))}

      <div>
        <label className="block text-xs text-slate">Bio</label>
        <textarea
          rows={4}
          value={form.bio || ""}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className="mt-1 w-full rounded-md border border-line bg-transparent px-3 py-2 text-sm text-bone"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-slate">LinkedIn URL</label>
          <input
            value={form.socials?.linkedin || ""}
            onChange={(e) => setForm({ ...form, socials: { ...form.socials, linkedin: e.target.value } })}
            className="mt-1 w-full rounded-md border border-line bg-transparent px-3 py-2 text-sm text-bone"
          />
        </div>
        <div>
          <label className="block text-xs text-slate">GitHub URL</label>
          <input
            value={form.socials?.github || ""}
            onChange={(e) => setForm({ ...form, socials: { ...form.socials, github: e.target.value } })}
            className="mt-1 w-full rounded-md border border-line bg-transparent px-3 py-2 text-sm text-bone"
          />
        </div>
      </div>

      <div className="space-y-4 border-t border-line pt-4">
        <p className="text-xs uppercase tracking-wide text-slate">Skills</p>
        {SKILL_GROUPS.map((g) => (
          <div key={g.key}>
            <label className="block text-xs text-slate">{g.label} (comma separated)</label>
            <input
              value={form.skills[g.key]}
              onChange={(e) => setForm({ ...form, skills: { ...form.skills, [g.key]: e.target.value } })}
              className="mt-1 w-full rounded-md border border-line bg-transparent px-3 py-2 text-sm text-bone"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={saving} className="rounded-full bg-amber px-5 py-2 text-xs font-medium text-ink">
          {saving ? "Saving…" : "Save profile"}
        </button>
        {saved && <span className="text-xs text-cyan">Saved.</span>}
      </div>
    </form>
  );
}

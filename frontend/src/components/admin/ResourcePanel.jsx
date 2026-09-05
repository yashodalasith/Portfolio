import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import client from "../../api/client.js";
import ImageUploadField from "./ImageUploadField.jsx";

const emptyValueFor = (field) => {
  if (field.type === "tags" || field.type === "lines") return [];
  if (field.type === "checkbox") return false;
  if (field.type === "number") return 0;
  return "";
};

function toFormState(item, fields) {
  const state = {};
  for (const f of fields) {
    if (f.type === "tags") state[f.key] = (item?.[f.key] || []).join(", ");
    else if (f.type === "lines")
      state[f.key] = (item?.[f.key] || []).join("\n");
    else if (f.type === "images")
      state[f.key] = item?.[f.key]?.length
        ? item[f.key]
        : item?.imageUrl
          ? [item.imageUrl]
          : [];
    else state[f.key] = item?.[f.key] ?? emptyValueFor(f);
  }
  return state;
}

function toPayload(formState, fields) {
  const payload = {};
  for (const f of fields) {
    if (f.type === "tags")
      payload[f.key] = formState[f.key]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    else if (f.type === "lines")
      payload[f.key] = formState[f.key]
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    else if (f.type === "number")
      payload[f.key] = Number(formState[f.key]) || 0;
    else if (f.type === "images") payload[f.key] = formState[f.key];
    else payload[f.key] = formState[f.key];
  }
  return payload;
}

// Generic list + create/edit form for a single resource type (experience,
// project, certification, or education), driven entirely by a `fields` config
// so we don't repeat this UI four times.
export default function ResourcePanel({
  resource,
  title,
  fields,
  listEndpoint,
  titleKey = "title",
}) {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null); // null = not editing, "new" = creating
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(null);

  async function load() {
    try {
      const { data } = await client.get(listEndpoint);
      setItems(data);
    } catch {
      setLoadError("Couldn't load this list.");
    }
  }

  useEffect(() => {
    setEditingId(null);
    setForm(null);
    setLoadError(null);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  function startNew() {
    setEditingId("new");
    setForm(toFormState(null, fields));
  }

  function startEdit(item) {
    setEditingId(item._id);
    setForm(toFormState(item, fields));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = toPayload(form, fields);
      if (editingId === "new") {
        await client.post(`/admin/${resource}`, payload);
      } else {
        await client.put(`/admin/${resource}/${editingId}`, payload);
      }
      setEditingId(null);
      setForm(null);
      await load();
    } catch {
      alert("Save failed — check the backend logs.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this item?")) return;
    await client.delete(`/admin/${resource}/${id}`);
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-medium text-bone">{title}</h2>
        <button
          onClick={startNew}
          className="flex items-center gap-1.5 rounded-full bg-amber px-4 py-2 text-xs font-medium text-ink"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {loadError && <p className="mt-3 text-sm text-red-400">{loadError}</p>}

      {editingId && form && (
        <form
          onSubmit={handleSave}
          className="mt-6 space-y-4 rounded-lg border border-line bg-ink-raised p-5"
        >
          {fields.map((f) => {
            if (f.type === "images" || f.type === "file") {
              return (
                <ImageUploadField
                  key={f.key}
                  label={f.label}
                  value={form[f.key]}
                  multiple={f.type === "images"}
                  accept={
                    f.type === "file"
                      ? "image/*,.pdf,application/pdf"
                      : "image/*"
                  }
                  onChange={(value) => setForm({ ...form, [f.key]: value })}
                />
              );
            }
            if (f.type === "checkbox") {
              return (
                <label
                  key={f.key}
                  className="flex items-center gap-2 text-sm text-slate"
                >
                  <input
                    type="checkbox"
                    checked={!!form[f.key]}
                    onChange={(e) =>
                      setForm({ ...form, [f.key]: e.target.checked })
                    }
                  />
                  {f.label}
                </label>
              );
            }
            if (f.type === "textarea" || f.type === "lines") {
              return (
                <div key={f.key}>
                  <label className="block text-xs text-slate">
                    {f.label} {f.type === "lines" && "(one per line)"}
                  </label>
                  <textarea
                    rows={f.type === "lines" ? 4 : 3}
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm({ ...form, [f.key]: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-line bg-transparent px-3 py-2 text-sm text-bone"
                  />
                </div>
              );
            }
            return (
              <div key={f.key}>
                <label className="block text-xs text-slate">
                  {f.label} {f.type === "tags" && "(comma separated)"}
                </label>
                <input
                  type={f.type === "number" ? "number" : "text"}
                  value={form[f.key]}
                  onChange={(e) =>
                    setForm({ ...form, [f.key]: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-line bg-transparent px-3 py-2 text-sm text-bone"
                />
              </div>
            );
          })}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-cyan px-5 py-2 text-xs font-medium text-ink"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(null);
              }}
              className="rounded-full border border-line px-5 py-2 text-xs text-slate"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <ul className="mt-6 space-y-2">
        {items.map((item) => (
          <li
            key={item._id}
            className="flex items-center justify-between rounded-md border border-line px-4 py-3"
          >
            <span className="text-sm text-bone">{item[titleKey]}</span>
            <div className="flex gap-3">
              <button
                onClick={() => startEdit(item)}
                aria-label="Edit"
                className="text-slate hover:text-cyan"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                aria-label="Delete"
                className="text-slate hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
        {!items.length && (
          <p className="text-sm text-slate">Nothing here yet.</p>
        )}
      </ul>
    </div>
  );
}

import { useEffect, useState } from "react";
import { api } from "../../lib/api.js";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () => api.adminProjects().then((d) => setProjects(d.projects));

  useEffect(() => {
    load();
  }, []);

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({
      name: p.name || "",
      location: p.location || "",
      category: p.category || "",
      priceLabel: p.priceLabel || "",
      description: p.description || "",
      isVerified: p.isVerified,
      videoUrl: p.videoUrl || "",
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.adminUpdateProject(editing, {
        ...form,
        location: form.location || null,
        category: form.category || null,
        priceLabel: form.priceLabel || null,
        description: form.description || null,
        videoUrl: form.videoUrl || null,
      });
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-800">Projects</h1>
        <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
          Edit project details shown on the public website.
        </p>
      </div>
      <div className="space-y-4">
        {projects.map((p) => (
          <div key={p.id} className="card p-6 transition-shadow duration-200 hover:shadow-[var(--shadow-sm)]">
            {editing === p.id ? (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="form-input" placeholder="Name" value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                  <input className="form-input" placeholder="Location" value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
                  <input className="form-input" placeholder="Category" value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
                  <input className="form-input" placeholder="Price label" value={form.priceLabel}
                    onChange={(e) => setForm((f) => ({ ...f, priceLabel: e.target.value }))} />
                </div>
                <textarea className="form-input" rows={3} placeholder="Description" value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                <input className="form-input" placeholder="Video URL (leave blank for branded fallback)" value={form.videoUrl}
                  onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))} />
                <label className="flex items-center gap-2 text-sm text-navy-700">
                  <input type="checkbox" checked={form.isVerified}
                    onChange={(e) => setForm((f) => ({ ...f, isVerified: e.target.checked }))} />
                  Details verified (publish full project page)
                </label>
                <div className="flex gap-3 pt-1">
                  <button onClick={save} disabled={saving} className="btn-primary !px-4 !py-2 text-xs disabled:opacity-60">
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button onClick={() => setEditing(null)} className="btn-secondary !px-4 !py-2 text-xs">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="icon-badge is-hoverable icon-badge-navy mt-0.5 shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M3 21h18M5 21V10.5L12 4l7 6.5V21M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy-800">{p.name}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[color:var(--color-text-muted)]">
                      <span>{p.location || "Location not verified"}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          p.isVerified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {p.isVerified ? "Verified" : "Unverified — coming soon"}
                      </span>
                    </div>
                    {p.priceLabel && <p className="mt-1.5 text-sm font-medium text-gold-600">{p.priceLabel}</p>}
                  </div>
                </div>
                <button onClick={() => startEdit(p)} className="btn-secondary shrink-0 !px-4 !py-2 text-xs">
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { api } from "../../lib/api.js";

export default function AdminContent() {
  const [blocks, setBlocks] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [savingKey, setSavingKey] = useState(null);
  const [savedKey, setSavedKey] = useState(null);

  useEffect(() => {
    api.adminContent().then((d) => {
      setBlocks(d.blocks);
      setDrafts(Object.fromEntries(d.blocks.map((b) => [b.key, b.value])));
    });
  }, []);

  const save = async (key) => {
    setSavingKey(key);
    try {
      await api.adminUpdateContent(key, drafts[key]);
      setSavedKey(key);
      window.setTimeout(() => setSavedKey((k) => (k === key ? null : k)), 2000);
    } finally {
      setSavingKey(null);
    }
  };

  const original = Object.fromEntries(blocks.map((b) => [b.key, b.value]));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-800">Content</h1>
        <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
          Edit the text blocks shown across the public website.
        </p>
      </div>

      {blocks.length === 0 ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card h-32 animate-pulse bg-navy-50/60" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {blocks.map((b) => {
            const isDirty = drafts[b.key] !== original[b.key];
            return (
              <div key={b.key} className="card p-6">
                <div className="mb-2 flex items-center justify-between">
                  <label className="form-label !mb-0" htmlFor={b.key}>{b.label}</label>
                  {isDirty && (
                    <span className="rounded-full bg-gold-50 px-2 py-0.5 text-[11px] font-medium text-gold-700">
                      Unsaved changes
                    </span>
                  )}
                </div>
                <textarea
                  id={b.key}
                  rows={4}
                  className="form-input transition-colors duration-200 focus:border-gold-400"
                  value={drafts[b.key] ?? ""}
                  onChange={(e) => setDrafts((d) => ({ ...d, [b.key]: e.target.value }))}
                />
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => save(b.key)}
                    disabled={savingKey === b.key || !isDirty}
                    className="btn-primary !px-4 !py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingKey === b.key ? "Saving..." : "Save"}
                  </button>
                  {savedKey === b.key && (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 10l3.5 3.5L15 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Saved
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

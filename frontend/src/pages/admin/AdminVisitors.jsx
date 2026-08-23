import { useEffect, useState } from "react";
import { api } from "../../lib/api.js";

export default function AdminVisitors() {
  const [pageViews, setPageViews] = useState(null);
  const [searches, setSearches] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.adminPageViews(), api.adminSearchQueries()])
      .then(([pv, sq]) => {
        setPageViews(pv);
        setSearches(sq);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="mb-2 h-7 w-48 animate-pulse rounded bg-navy-50" />
        <div className="mb-8 h-4 w-80 animate-pulse rounded bg-navy-50" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card h-24 animate-pulse bg-navy-50/60" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-navy-800">Visitor Activity</h1>
      <p className="mb-8 text-sm text-[color:var(--color-text-muted)]">
        Anonymous page views and on-site searches, tracked automatically as people browse the
        public website.
      </p>

      {/* Summary tiles */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="card group relative overflow-hidden p-5">
          <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-gold-400 to-gold-600 transition-transform duration-500 ease-out group-hover:scale-x-100" />
          <p className="text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">Total page views</p>
          <p className="mt-1 font-display text-2xl font-bold text-navy-800">{pageViews.recent.length >= 200 ? "200+" : pageViews.topPaths.reduce((s, p) => s + p.views, 0)}</p>
        </div>
        <div className="card group relative overflow-hidden p-5">
          <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-gold-400 to-gold-600 transition-transform duration-500 ease-out group-hover:scale-x-100" />
          <p className="text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">Unique visitors</p>
          <p className="mt-1 font-display text-2xl font-bold text-navy-800">{pageViews.uniqueVisitors}</p>
        </div>
        <div className="card group relative overflow-hidden p-5">
          <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-gold-400 to-gold-600 transition-transform duration-500 ease-out group-hover:scale-x-100" />
          <p className="text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">Searches performed</p>
          <p className="mt-1 font-display text-2xl font-bold text-navy-800">{searches.topQueries.reduce((s, q) => s + q.count, 0)}</p>
        </div>
      </div>

      {/* Top pages */}
      <h2 className="mb-3 text-lg font-semibold text-navy-800">Most-viewed pages</h2>
      {pageViews.topPaths.length === 0 ? (
        <div className="mb-10 rounded-[var(--radius-card)] border border-dashed border-[color:var(--color-border)] bg-white p-8 text-center text-sm text-[color:var(--color-text-muted)]">
          No page views recorded yet.
        </div>
      ) : (
        <div className="mb-10 overflow-x-auto rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[color:var(--color-border)] bg-navy-50 text-navy-700">
              <tr>
                <th className="p-4">Path</th>
                <th className="p-4">Views</th>
              </tr>
            </thead>
            <tbody>
              {pageViews.topPaths.map((p) => (
                <tr key={p.path} className="border-b border-[color:var(--color-border)] transition-colors last:border-0 hover:bg-navy-50/40">
                  <td className="p-4 font-medium text-navy-800">{p.path}</td>
                  <td className="p-4 text-[color:var(--color-text-muted)]">{p.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Top searches */}
      <h2 className="mb-3 text-lg font-semibold text-navy-800">Top search terms</h2>
      {searches.topQueries.length === 0 ? (
        <div className="mb-10 rounded-[var(--radius-card)] border border-dashed border-[color:var(--color-border)] bg-white p-8 text-center text-sm text-[color:var(--color-text-muted)]">
          No searches recorded yet.
        </div>
      ) : (
        <div className="mb-10 overflow-x-auto rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[color:var(--color-border)] bg-navy-50 text-navy-700">
              <tr>
                <th className="p-4">Query</th>
                <th className="p-4">Times searched</th>
              </tr>
            </thead>
            <tbody>
              {searches.topQueries.map((q) => (
                <tr key={q.query} className="border-b border-[color:var(--color-border)] transition-colors last:border-0 hover:bg-navy-50/40">
                  <td className="p-4 font-medium text-navy-800">{q.query}</td>
                  <td className="p-4 text-[color:var(--color-text-muted)]">{q.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recent activity */}
      <h2 className="mb-3 text-lg font-semibold text-navy-800">Recent page views</h2>
      {pageViews.recent.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-[color:var(--color-border)] bg-white p-8 text-center text-sm text-[color:var(--color-text-muted)]">
          No page views recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[color:var(--color-border)] bg-navy-50 text-navy-700">
              <tr>
                <th className="p-4">Path</th>
                <th className="p-4">Referrer</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {pageViews.recent.slice(0, 50).map((v) => (
                <tr key={v.id} className="border-b border-[color:var(--color-border)] transition-colors last:border-0 hover:bg-navy-50/40">
                  <td className="p-4 font-medium text-navy-800">{v.path}</td>
                  <td className="p-4 text-[color:var(--color-text-muted)]">{v.referrer || "—"}</td>
                  <td className="p-4 text-[color:var(--color-text-muted)]">
                    {new Date(v.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

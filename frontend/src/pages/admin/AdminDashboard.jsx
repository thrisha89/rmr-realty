import { useEffect, useState } from "react";
import { api } from "../../lib/api.js";

const PRIMARY = {
  leadCount: { label: "Total Leads", icon: "M4 5h16v11H7l-3 3V5z" },
  newLeadCount: { label: "New Leads", icon: "M12 4v16m8-8H4" },
  brokerCount: { label: "Broker Registrations", icon: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" },
};

const ACTIVITY_META = {
  projectCount: { label: "Projects", icon: "M3 21h18M5 21V10.5L12 4l7 6.5V21M9 21v-6h6v6" },
  conversationCount: { label: "Chatbot Conversations", icon: "M4 12c0-4.4 3.8-8 8.5-8S21 7.6 21 12s-3.8 8-8.5 8c-1 0-1.96-.16-2.85-.46L5 21l1.1-3.6C4.8 16.1 4 14.15 4 12z" },
  pageViewCount: { label: "Page Views", icon: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z M12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" },
  searchQueryCount: { label: "Searches", icon: "M11 4a7 7 0 105.29 12.04l4.35 4.35 1.42-1.42-4.35-4.35A7 7 0 0011 4z" },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.adminDashboard().then((d) => setStats(d.stats));
  }, []);

  const activityMax = stats
    ? Math.max(1, ...Object.keys(ACTIVITY_META).map((k) => stats[k] ?? 0))
    : 1;

  return (
    <div>
      <div className="mb-10 flex flex-col gap-2 border-b border-[color:var(--color-border)] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2">Command Centre</p>
          <h1 className="font-display text-2xl font-bold text-navy-800 sm:text-3xl">Overview</h1>
        </div>
        <p className="max-w-xs text-sm text-[color:var(--color-text-muted)] sm:text-right">
          Live figures from the RMR Realty database — updates in real time as visitors interact with the site.
        </p>
      </div>

      {!stats ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-[1.5rem] bg-navy-50/60" />
          ))}
        </div>
      ) : (
        <>
          {/* Primary KPI row — the metrics that matter most get a taller,
              darker, higher-priority treatment instead of matching the
              secondary stats visually. */}
          <div className="grid gap-6 lg:grid-cols-3">
            {Object.entries(PRIMARY).map(([key, meta], i) => (
              <div
                key={key}
                className={`group relative overflow-hidden rounded-[1.5rem] p-7 shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] ${
                  i === 0
                    ? "bg-gradient-to-br from-navy-800 to-navy-900 text-white"
                    : "border border-[color:var(--color-border)] bg-white"
                }`}
              >
                {i === 0 && (
                  <div className="gold-atmosphere gold-atmosphere-hero-a opacity-70" />
                )}
                <div className="relative flex items-start justify-between">
                  <div className={`icon-badge ${i === 0 ? "icon-badge-gold" : "icon-badge-navy"}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d={meta.icon} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {i === 0 && stats.newLeadCount > 0 && (
                    <span className="rounded-full bg-gold-400/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold-300">
                      {stats.newLeadCount} new
                    </span>
                  )}
                </div>
                <p className={`relative mt-6 font-display text-4xl font-bold ${i === 0 ? "text-white" : "text-navy-800"}`}>
                  {stats[key] ?? 0}
                </p>
                <p className={`relative mt-1 text-sm font-medium ${i === 0 ? "text-navy-200" : "text-[color:var(--color-text-muted)]"}`}>
                  {meta.label}
                </p>
              </div>
            ))}
          </div>

          {/* Secondary section — activity distribution as a horizontal bar
              comparison (built from real stat values) beside a compact
              engagement list, so the dashboard visually prioritizes
              information density rather than a flat repeated card grid. */}
          <div className="mt-8 grid gap-6 lg:grid-cols-5">
            <div className="rounded-[1.5rem] border border-[color:var(--color-border)] bg-white p-7 lg:col-span-3">
              <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.1em] text-navy-800">
                Activity Distribution
              </h2>
              <div className="flex flex-col gap-5">
                {Object.entries(ACTIVITY_META).map(([key, meta]) => {
                  const value = stats[key] ?? 0;
                  const pct = Math.max(4, Math.round((value / activityMax) * 100));
                  return (
                    <div key={key}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-medium text-navy-700">
                          <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold-500" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path d={meta.icon} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {meta.label}
                        </span>
                        <span className="font-display font-bold text-navy-800">{value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-navy-50">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-[width] duration-700 ease-out"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 rounded-[1.5rem] bg-navy-800 p-7 text-white lg:col-span-2">
              <div>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.1em] text-gold-300">
                  Conversion Snapshot
                </h2>
                <p className="text-sm text-navy-200">
                  Share of visitors who went on to submit an enquiry.
                </p>
              </div>
              <div className="flex items-end gap-3">
                <p className="font-display text-5xl font-bold text-white">
                  {stats.pageViewCount > 0
                    ? `${Math.min(100, Math.round((stats.leadCount / stats.pageViewCount) * 100))}%`
                    : "—"}
                </p>
                <p className="mb-1 text-xs text-navy-300">
                  {stats.leadCount} leads / {stats.pageViewCount} views
                </p>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-300 to-gold-500"
                  style={{
                    width: `${
                      stats.pageViewCount > 0
                        ? Math.min(100, Math.round((stats.leadCount / stats.pageViewCount) * 100))
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

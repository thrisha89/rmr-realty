import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";

function initialsOf(name) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function Account() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const STATUS_META = {
    new: { label: t("accountPage.statusNew"), classes: "bg-navy-50 text-navy-700 ring-1 ring-inset ring-navy-200" },
    contacted: { label: t("accountPage.statusContacted"), classes: "bg-gold-50 text-gold-700 ring-1 ring-inset ring-gold-300" },
    closed: { label: t("accountPage.statusClosed"), classes: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200" },
  };

  useEffect(() => {
    api
      .myEnquiries()
      .then((d) => setLeads(d.leads))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/");
    } finally {
      setLoggingOut(false);
    }
  };

  const openCount = leads.filter((l) => l.status !== "closed").length;

  return (
    <div>
      {/* Profile header */}
      <section className="bg-navy-800">
        <div className="container-content flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="flex items-center gap-5">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-b from-gold-400 to-gold-500 font-display text-xl font-bold text-navy-900 shadow-[0_8px_20px_-8px_rgba(200,144,56,0.55)]">
              {initialsOf(user?.fullName)}
            </div>
            <div>
              <p className="eyebrow mb-1 text-gold-400">{t("nav.myAccount")}</p>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">{user?.fullName}</h1>
              <p className="mt-1 text-sm text-navy-200">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="btn-secondary !border-white/70 !text-white shrink-0 hover:!bg-white hover:!text-navy-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M7 4H4.5A1.5 1.5 0 003 5.5v9A1.5 1.5 0 004.5 16H7M13 13.5l3.5-3.5L13 6.5M16.25 10H7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {loggingOut ? t("form.submitting") : t("nav.logout")}
          </button>
        </div>
      </section>

      <div className="section-pad container-content max-w-3xl">
        {/* Quick stats */}
        <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="card p-5 text-center">
            <p className="font-display text-2xl font-bold text-navy-800">{loading ? "—" : leads.length}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[color:var(--color-text-muted)]">
              {t("nav.myEnquiries")}
            </p>
          </div>
          <div className="card p-5 text-center">
            <p className="font-display text-2xl font-bold text-navy-800">{loading ? "—" : openCount}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[color:var(--color-text-muted)]">
              {t("accountPage.inProgress")}
            </p>
          </div>
          <div className="card col-span-2 flex flex-col justify-center p-5 text-center sm:col-span-1">
            <p className="font-display text-2xl font-bold text-emerald-600">{t("accountPage.statusActive")}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[color:var(--color-text-muted)]">
              {t("accountPage.accountStatus")}
            </p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy-800">{t("nav.myEnquiries")}</h2>
          <Link to="/contact" className="btn-ghost !px-3 !py-1.5 text-xs">
            {t("accountPage.newEnquiry")}
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="card h-16 animate-pulse bg-navy-50/60" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="card flex flex-col items-center gap-4 p-10 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-navy-50 text-navy-400">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 5h16v11H7l-3 3V5z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm text-[color:var(--color-text-muted)]">
              {t("accountPage.emptyEnquiries")}
            </p>
            <Link to="/projects" className="btn-primary !px-5 !py-2.5 text-xs">
              {t("accountPage.browseProjects")}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.map((l) => {
              const meta = STATUS_META[l.status] || { label: l.status, classes: "bg-navy-50 text-navy-700" };
              return (
                <div key={l.id} className="card flex items-center justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-navy-800">
                      {l.projectName || t("accountPage.generalEnquiry")}
                    </p>
                    <p className="mt-0.5 text-xs text-[color:var(--color-text-muted)]">
                      {new Date(l.createdAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${meta.classes}`}>
                    {meta.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

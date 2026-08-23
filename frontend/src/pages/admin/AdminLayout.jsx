import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "M4 13h6V4H4v9zM14 20h6v-9h-6v9zM14 4v3h6V4h-6zM4 20h6v-3H4v3z" },
  { to: "/admin/users", label: "Users", icon: "M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9.5 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM19.5 20v-1a3.5 3.5 0 00-2.5-3.36M15 4.13a3.5 3.5 0 010 6.74" },
  { to: "/admin/leads", label: "Leads", icon: "M4 5h16v11H7l-3 3V5z" },
  { to: "/admin/brokers", label: "Brokers", icon: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" },
  { to: "/admin/projects", label: "Projects", icon: "M3 21h18M5 21V10.5L12 4l7 6.5V21M9 21v-6h6v6" },
  { to: "/admin/content", label: "Content", icon: "M4 6h16M4 12h16M4 18h10" },
  { to: "/admin/chatbot", label: "Chatbot", icon: "M4 12c0-4.4 3.8-8 8.5-8S21 7.6 21 12s-3.8 8-8.5 8c-1 0-1.96-.16-2.85-.46L5 21l1.1-3.6C4.8 16.1 4 14.15 4 12z" },
  { to: "/admin/visitors", label: "Visitors", icon: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z M12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" },
];

function initialsOf(name) {
  if (!name) return "A";
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

export default function AdminLayout() {
  const { logout, admin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);

  const currentLabel = links.find((l) => location.pathname.startsWith(l.to))?.label || "Admin";

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/admin/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[color:var(--color-surface)]">
      {/* Sidebar — fixed/stationary; only the main content area scrolls */}
      <aside className="flex h-screen w-64 shrink-0 flex-col bg-navy-800 text-white">
        <div className="flex items-center gap-3 border-b border-white/10 p-6">
          <div className="rounded-md bg-white p-1.5 shadow-[0_6px_14px_-6px_rgba(0,0,0,0.35)]">
            <img src="/media/brand/logo.png" alt="RMR Realty" className="h-8 w-auto" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight text-white">RMR Realty</p>
            <p className="text-[11px] uppercase tracking-[0.15em] text-navy-300">Admin</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/[0.08] text-gold-300"
                    : "text-navy-200 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gold-400 transition-all duration-200 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <svg
                    viewBox="0 0 24 24"
                    className={`h-[18px] w-[18px] shrink-0 transition-transform duration-200 ${
                      isActive ? "" : "group-hover:scale-110"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path d={l.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {l.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-b from-gold-400 to-gold-500 text-xs font-bold text-navy-900">
              {initialsOf(admin?.username)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">{admin?.username || "Admin"}</p>
              <p className="text-[11px] text-navy-300">Signed in</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2.5 text-sm text-navy-100 transition-colors duration-200 hover:border-white/25 hover:bg-white/5 disabled:opacity-60"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M7 4H4.5A1.5 1.5 0 003 5.5v9A1.5 1.5 0 004.5 16H7M13 13.5l3.5-3.5L13 6.5M16.25 10H7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {loggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main content — this is the only scrollable region */}
      <div className="flex h-screen min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-[color:var(--color-border)] bg-white/70 px-8 py-4 backdrop-blur-sm">
          <h1 className="text-lg font-semibold text-navy-800">{currentLabel}</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
